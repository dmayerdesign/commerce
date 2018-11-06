import { Discount } from '@mte/common/api/entities/discount'
import { Order } from '@mte/common/api/entities/order'
import { Product } from '@mte/common/api/entities/product'
import { GetProductsFromIdsRequest } from '@mte/common/api/requests/get-products.request'
import { ListFromIdsRequest } from '@mte/common/api/requests/list.request'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { StripeCreateOrderResponse } from '@mte/common/api/responses/stripe/stripe-create-order.response'
import { StripePayOrderResponse } from '@mte/common/api/responses/stripe/stripe-pay-order.response'
import { Copy } from '@mte/common/constants'
import { OrderStatus } from '@mte/common/constants/enums/order-status'
import { Types } from '@mte/common/constants/inversify/types'
import { StripeOrder } from '@mte/common/lib/stripe-shims/stripe-order'
import { inject, injectable } from 'inversify'
import * as Stripe from 'stripe'
import { DbClient } from '../../data-access/db-client'
import { OrderHelper } from '../../helpers/order.helper'
import { DiscountService } from '../discount.service'
import { OrganizationService } from '../organization.service'
import { ProductService } from '../product.service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Stripe service
 *
 * @export
 * @class StripeOrderService
 * @description Methods for interacting with the Stripe Orders API
 */
@injectable()
export class StripeOrderActionsService {

    constructor(
        @inject(Types.ProductService) private productService: ProductService,
        @inject(Types.DiscountService) private discountService: DiscountService,
        @inject(Types.OrderHelper) private orderHelper: OrderHelper,
        @inject(Types.OrganizationService) private organizationService: OrganizationService,
        @inject(Types.DbClient) private dbClient: DbClient<Order>,
    ) { }

    /**
     * Create a Stripe order
     *
     * @public
     * @param {Order} order An order in the database
     * @returns {Promise<StripeCreateOrderResponse>}
     * @memberof StripeService
     */
    public async createOrder(order: Order): Promise<StripeCreateOrderResponse> {
        let orderItems: Product[]
        let orderDiscounts: Discount[]

        if (!order.total
            || !order.total.currency
            || !order.customer.email) {
            throw new Error(Copy.ErrorMessages.invalidOrder)
        }

        order.subTotal.amount = 0
        order.total.amount = 0

        try {
            const organizationResponse = await this.organizationService.getOrganization()
            const organization = organizationResponse.body
            const orderItemsRequest = new GetProductsFromIdsRequest()
            orderItemsRequest.ids = order.items as string[]
            const orderItemsResponse = await this.productService.getIds(orderItemsRequest)
            orderItems = orderItemsResponse.body
            order.subTotal = this.orderHelper.getSubTotal(orderItems)
            order.total = this.orderHelper.getTotal(
                order.subTotal,
                organization.retailSettings.addSalesTax,
                organization.retailSettings.salesTaxPercentage
            )
        }
        catch (getItemsError) {
            throw getItemsError
        }

        try {
            const orderDiscountsRequest = new ListFromIdsRequest({ ids: order.discounts as string[], limit: 0 })
            const orderDiscountsResponse = await this.discountService.getIds(orderDiscountsRequest)
            orderDiscounts = orderDiscountsResponse.body
            orderDiscounts.forEach(orderDiscount => {
                order.total.amount -= orderDiscount.total.amount
            })
        }
        catch (getDiscountsError) {
            throw getDiscountsError
        }

        const dbOrder = new Order(order)

        // Build the stripe order.
        const stripeOrder = new StripeOrder()
        stripeOrder.shipping = {
            name: order.customer.firstName + ' ' + order.customer.lastName,
            address: {
                line1: order.customer.shippingAddress.street1,
                line2: order.customer.shippingAddress.street2 || '',
                city: order.customer.shippingAddress.city,
                state: order.customer.shippingAddress.state,
                country: order.customer.shippingAddress.country,
                postal_code: order.customer.shippingAddress.zip,
            },
        }
        stripeOrder.currency = order.total.currency
        if (order.customer.stripeCustomerId) {
            stripeOrder.customer = order.customer.stripeCustomerId
        }
        stripeOrder.email = order.customer.email
        stripeOrder.items = orderItems.map((product) => {
            return {
                type: 'sku' as 'sku',
                parent: product.sku, // Note: this does NOT mean "parent product". "Parent" here
                    // means "ID of the product associated with this OrderItemCreationHash".
                    // (We're using skus as IDs)
                quantity: 1,
            }
        })

        try {
            // The `StripeOrder` prototype needs to be erased, because that's the way `stripe` needs it
            // (which is absolutely ridiculous).
            const stripeOrderData = Object.assign({}, stripeOrder)
            const newStripeOrder = await stripe.orders.create(stripeOrderData)
            dbOrder.stripeOrderId = newStripeOrder.id
            const newOrder = await dbOrder.save()
            return new StripeCreateOrderResponse({
                order: newOrder._doc,
                stripeOrder: newStripeOrder,
            })
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    /**
     * @description Pay a stripe order
     * @public
     * @param {Order} order An order from the database
     * @returns {Promise<StripePayOrderResponse>}
     * @memberof StripeService
     */
    public async payOrder(order: Order): Promise<StripePayOrderResponse> {
        const payment: Stripe.orders.IOrderPayOptions = {
            metadata: {
                orderID: order._id.toString(),
            },
        }

        if (order.customer.stripeCustomerId && !order.stripeToken && !order.stripeCardId) {
            payment.customer = order.customer.stripeCustomerId
        }
        else if ((order.stripeToken || order.stripeCardId) && order.customer.email) {
            payment.source = order.stripeToken.id || order.stripeCardId
            payment.email = order.customer.email
        }
        else {
            throw new Error('Missing one of: Stripe Customer ID, Stripe Token ID, or email')
        }

        if (order.savePaymentInfo && order.stripeToken && order.customer.stripeCustomerId) {
            delete payment.source
            delete payment.email
            payment.customer = order.customer.stripeCustomerId

            try {
                const card = await stripe.customers.createSource(order.customer.stripeCustomerId, { source: order.stripeToken.id })
                if (!card) throw new Error('Couldn\'t save your payment info. Please try again.')
                await stripe.customers.update(order.customer.stripeCustomerId, {
                    default_source: card.id
                })
            }
            catch (error) {
                throw error
            }
        }

        // Make the payment.

        try {
            const paidStripeOrder = await stripe.orders.pay(order.stripeOrderId, payment, {
                idempotency_key: order._id.toString()
            })
            const unpaidDbOrder = await this.dbClient.findById(Order, order._id)
            unpaidDbOrder.status = OrderStatus.Paid
            const paidOrder = await this.dbClient.save(unpaidDbOrder)
            return new StripePayOrderResponse({
                paidOrder,
                paidStripeOrder,
            })
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }
}
