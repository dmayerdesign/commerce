import { HttpException, Inject, Injectable } from '@nestjs/common'
import { Copy } from '@qb/common/constants/copy'
import { HttpStatus } from '@qb/common/constants/http-status'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { Order } from '@qb/common/domains/order/order'
import { StripeSubmitOrderResponse } from '@qb/common/domains/order/stripe/stripe-submit-order.response'
import { Product } from '@qb/common/domains/product/product'
import { customers } from 'stripe'
import { ObjectID } from 'typeorm'
import { ProductRepository } from '../../product/product.repository'
import { StripeCustomerService } from './stripe-customer.service'
import { StripeOrderActionsService } from './stripe-order-actions.service'
import { StripeProductService } from './stripe-product.service'

/**
 * Stripe service
 *
 * @export
 * @class StripeService
 * @description Methods for interacting with the Stripe API
 */
@Injectable()
export class StripeOrderService {

    constructor(
        @Inject(ProductRepository) private _productRepository: ProductRepository,
        @Inject(StripeCustomerService) private stripeCustomerService: StripeCustomerService,
        @Inject(StripeOrderActionsService) private stripeOrderActionsService: StripeOrderActionsService,
        @Inject(StripeProductService) private stripeProductService: StripeProductService,
    ) { }

    /**
     * Submit an order. Creates an order in Stripe, and immediately pays it
     *
     * @param {Order} orderData An object representing the order to be created and paid
     * @param {Product[]} variationsAndStandalones Products from the database representing the variations and standalone products purchased
     */
    public async submitOrder(orderData: Order): Promise<StripeSubmitOrderResponse> {
        const variationAndStandaloneSkus: string[] = []
        const parentIds: ObjectID[] = []
        orderData.products.forEach((orderProduct: Product) => {
            variationAndStandaloneSkus.push(orderProduct.sku)
        })
        const request = new ListRequest({
            query: { sku: { $in: variationAndStandaloneSkus } },
            limit: 0
        })
        const variationsAndStandalones = await this._productRepository.list(request)
        const variations = variationsAndStandalones.filter((variationOrStandalone) => variationOrStandalone.isVariation)
        const standalones = variationsAndStandalones.filter((variationOrStandalone) => !variationOrStandalone.isVariation)

        if (!variationsAndStandalones || !variationsAndStandalones.length) {
            throw new HttpException(
                Copy.ErrorMessages.productsNotFound,
                HttpStatus.CLIENT_ERROR_NOT_FOUND,
            )
        }

        variationsAndStandalones.forEach(product => {
            if (product.isVariation && product.parent) {
                if (typeof product.parent === 'string') {
                    parentIds.push(product.parent)
                }
                else if (product.parent.id) {
                    parentIds.push(product.parent.id)
                }
            }
        })
        // Retrieve parent products and combine them with `variationsAndStandalones` into `products`.
        // Use the new `products` array to create the products and SKUs in Stripe, if they don't exist.
        const findParentsRequest = new ListRequest({
            ids: parentIds,
            limit: 0
        })
        const parents = await this._productRepository.list(findParentsRequest)

        // Create the products and SKUs in Stripe.
        await this.stripeProductService.createProducts([ ...parents, ...standalones ])
        await this.stripeProductService.createSkus([ ...variations, ...standalones ])

        // Create the order in Stripe.
        const createOrderResponse = await this.stripeOrderActionsService.createOrder(orderData)
        const { order } = createOrderResponse
        // If the customer opted to save their payment info, create the customer in Stripe.
        if (order.customer && order.customer.savePaymentInfo) {
            const stripeCustomer = await this.stripeCustomerService
                .createCustomer(order) as customers.ICustomer
            // Update the order with the Stripe customer info.
            order.customer.stripeCustomerId = stripeCustomer.id
        }

        // Pay the order.
        const payOrderResponse = await this.stripeOrderActionsService.payOrder(order)
        const { paidOrder, paidStripeOrder } = payOrderResponse

        return new StripeSubmitOrderResponse({
            order: paidOrder,
            stripeOrder: paidStripeOrder,
        })
    }
}
