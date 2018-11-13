import { Inject, Injectable } from '@nestjs/common'
import { Order } from '@qb/common/api/entities/order'
import { Discount as IDiscount } from '@qb/common/api/interfaces/discount'
import { Order as IOrder } from '@qb/common/api/interfaces/order'
import { Product as IProduct } from '@qb/common/api/interfaces/product'
import { GetProductsRequest } from '@qb/common/api/requests/get-products.request'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { ApiErrorResponse } from '@qb/common/api/responses/api-error.response'
import { StripeCreateOrderResponse } from '@qb/common/api/responses/stripe/stripe-create-order.response'
import { StripePayOrderResponse } from '@qb/common/api/responses/stripe/stripe-pay-order.response'
import { Copy } from '@qb/common/constants/copy'
import { OrderStatus } from '@qb/common/constants/enums/order-status'
import { StripeOrder } from '@qb/common/stripe-shims/stripe-order'
import * as Stripe from 'stripe'
import { QbRepository } from '../../../shared/data-access/repository'
import { OrganizationService } from '../../organization/organization.service'
import { getSubTotal, getTotal } from '../order.helpers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Stripe service
 *
 * @export
 * @class StripeOrderService
 * @description Methods for interacting with the Stripe Orders API
 */
@Injectable()
export class StripeOrderActionsService {

    constructor(
        @Inject(OrganizationService) private organizationService: OrganizationService,
        @Inject(QbRepository) private _discountRepository: QbRepository<IDiscount>,
        @Inject(QbRepository) private _orderRepository: QbRepository<IOrder>,
        @Inject(QbRepository) private _productRepository: QbRepository<IProduct>,
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
        let orderItems: IProduct[]
        let orderDiscounts: IDiscount[]

        if (!order.total
            || !order.total.currency
            || !order.customer.email) {
            throw new Error(Copy.ErrorMessages.invalidOrder)
        }

        order.subTotal.amount = 0
        order.total.amount = 0

        try {
            const organization = await this.organizationService.getOrganization()
            const orderItemsRequest = new GetProductsRequest()
            orderItemsRequest.ids = order.items as string[]
            orderItems = await this._productRepository.list(orderItemsRequest)
            order.subTotal = getSubTotal(orderItems)
            order.total = getTotal(
                order.subTotal,
                organization.retailSettings.addSalesTax,
                organization.retailSettings.salesTaxPercentage
            )
        }
        catch (getItemsError) {
            throw getItemsError
        }

        try {
            const orderDiscountsRequest = new ListRequest({ ids: order.discounts as string[], limit: 0 })
            orderDiscounts = await this._discountRepository.list(orderDiscountsRequest)
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

        const paidStripeOrder = await stripe.orders.pay(order.stripeOrderId, payment, {
            idempotency_key: order._id.toString()
        })
        const unpaidDbOrder = await this._orderRepository.get(order._id)
        const paidOrder = await this._orderRepository.update(new UpdateRequest({
            id: unpaidDbOrder._id,
            update: {
                status: OrderStatus.Paid
            }
        }))
        return new StripePayOrderResponse({
            paidOrder,
            paidStripeOrder,
        })
    }
}
