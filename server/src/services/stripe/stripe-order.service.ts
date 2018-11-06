import { Order } from '@mte/common/api/entities/order'
import { FindProductsError, Product } from '@mte/common/api/entities/product'
import { ListFromIdsRequest, ListFromQueryRequest } from '@mte/common/api/requests/list.request'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { StripeSubmitOrderResponse } from '@mte/common/api/responses/stripe/stripe-submit-order.response'
import { Copy, HttpStatus } from '@mte/common/constants'
import { Types } from '@mte/common/constants/inversify/types'
import { inject, injectable } from 'inversify'
import 'stripe'
import { DbClient } from '../../data-access/db-client'
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
@injectable()
export class StripeOrderService {

    constructor(
        @inject(Types.DbClient) private dbClient: DbClient<any>,
        @inject(Types.StripeCustomerService) private stripeCustomerService: StripeCustomerService,
        @inject(Types.StripeOrderActionsService) private stripeOrderActionsService: StripeOrderActionsService,
        @inject(Types.StripeProductService) private stripeProductService: StripeProductService,
    ) { }

    /**
     * Submit an order. Creates an order in Stripe, and immediately pays it
     *
     * @param {Order} orderData An object representing the order to be created and paid
     * @param {Product[]} variationsAndStandalones Products from the database representing the variations and standalone products purchased
     */
    public async submitOrder(orderData: Order): Promise<StripeSubmitOrderResponse> {
        const variationAndStandaloneSkus: string[] = []
        const parentIds: string[] = []
        orderData.items.forEach((orderProduct: Product) => {
            variationAndStandaloneSkus.push(orderProduct.sku)
        })

        try {
            const request = new ListFromQueryRequest({
                query: { sku: { $in: variationAndStandaloneSkus } },
                limit: 0,
            })
            const variationsAndStandalones = await this.dbClient.findQuery<Product>(Product, request, null, [
                'attributeValues',
                'simpleAttributeValues',
            ])
            const variations = variationsAndStandalones.filter((variationOrStandalone) => variationOrStandalone.isVariation)
            const standalones = variationsAndStandalones.filter((variationOrStandalone) => !variationOrStandalone.isVariation)

            if (!variationsAndStandalones || !variationsAndStandalones.length) {
                throw new ApiErrorResponse(new FindProductsError(Copy.ErrorMessages.productsNotFound), HttpStatus.CLIENT_ERROR_NOT_FOUND)
            }

            variationsAndStandalones.forEach(product => {
                if (product.isVariation && product.parent) {
                    if (typeof product.parent === 'string') {
                        parentIds.push(product.parent)
                    }
                    else if (product.parent._id) {
                        parentIds.push(product.parent._id)
                    }
                }
            })
            // Retrieve parent products and combine them with `variationsAndStandalones` into `products`.
            // Use the new `products` array to create the products and SKUs in Stripe, if they don't exist.
            const findParentsRequest = new ListFromIdsRequest({
                ids: parentIds,
                limit: 0
            })
            const parents = await this.dbClient.findIds<Product>(Product, findParentsRequest, [
                'variableAttributes',
                'variableAttributeValues',
            ])

            // Create the products and SKUs in Stripe.
            const stripeProducts = await this.stripeProductService.createProducts([ ...parents, ...standalones ])
            await this.stripeProductService.createSkus([ ...variations, ...standalones ])

            // Create the order in Stripe.
            const createOrderResponse = await this.stripeOrderActionsService.createOrder(orderData)
            const { order } = createOrderResponse.body
            // If the customer opted to save their payment info, create the customer in Stripe.
            if (order.customer.savePaymentInfo) {
                const stripeCustomer = await this.stripeCustomerService.createCustomer(order)
                // Update the order with the Stripe customer info.
                order.customer.stripeCustomerId = stripeCustomer.id
            }

            // Pay the order.
            const payOrderResponse = await this.stripeOrderActionsService.payOrder(order)
            const { paidOrder, paidStripeOrder } = payOrderResponse.body

            return new StripeSubmitOrderResponse({
                order: paidOrder,
                stripeOrder: paidStripeOrder,
            })
        }
        catch (error) {
            if (error instanceof ApiErrorResponse) {
                throw error
            }
            else {
                throw new ApiErrorResponse(error)
            }
        }
    }
}
