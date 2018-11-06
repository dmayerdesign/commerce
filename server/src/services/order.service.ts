import { inject, injectable } from 'inversify'

import { Order } from '@mte/common/api/entities/order'
import { Product } from '@mte/common/api/entities/product'
import { GetCartItemsFromIdsRequest } from '@mte/common/api/requests/get-cart-items-from-ids.request'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { StripeSubmitOrderResponse } from '@mte/common/api/responses/stripe/stripe-submit-order.response'
import { Types } from '@mte/common/constants/inversify/types'
import { CartHelper } from '@mte/common/helpers/cart.helper'
import { UserHelper } from '@mte/common/helpers/user.helper'
import { DbClient } from '../data-access/db-client'
import { EmailService } from '../interfaces/email-service'
import { OrderService as IOrderService } from '../interfaces/order-service'
import { CartService } from './cart.service'
import { CrudService } from './crud.service'
import { OrganizationService } from './organization.service'
import { ProductService } from './product.service'
import { StripeOrderService } from './stripe/stripe-order.service'

/**
 * TODO:
 * - Create a way to extract useful data from orders
 * -- e.g. Which items did people purchase together?
 * -- Maybe create a `ProductRecommendationData` entity
 * --- { productId: string, purchasedWithProducts: { productId: string, count: number }[] }
 */
@injectable()
export class OrderService extends CrudService<Order> implements IOrderService {

    protected model = Order

    constructor(
        @inject(Types.DbClient) protected dbClient: DbClient<Order>,
        @inject(Types.StripeOrderService) private stripeOrderService: StripeOrderService,
        @inject(Types.CartService) private cartService: CartService,
        @inject(Types.ProductService) private productService: ProductService,
        @inject(Types.EmailService) private emailService: EmailService,
        @inject(Types.OrganizationService) private organizationService: OrganizationService,
    ) { super() }

    public async place(newOrder: Order): Promise<StripeSubmitOrderResponse> {
        try {
            // Hydrate the order (replace the `id`s stored in `order.items` with products).

            const order = await this._hydrate(newOrder)

            // Submit the order.

            const stripeSubmitOrderResponse = await this.stripeOrderService.submitOrder(order)

            const paidOrder = await this._hydrate(stripeSubmitOrderResponse.body.order)
            const parentProducts = await this.productService.getParentProducts(order.items as Product[])
            const allProducts = [ ...order.items as Product[], ...parentProducts ]

            // Update the stock quantity and total sales of each variation and standalone.

            this.productService.updateInventory(allProducts, paidOrder)

            // Set `existsInStripe` asynchronously.

            this.productService.update(allProducts.map((product) => product._id), {
                existsInStripe: true,
            })

            // Send a receipt.

            const getOrganizationResponse = await this.organizationService.getOrganization()
            const organization = getOrganizationResponse.body
            await this.emailService.sendReceipt({
                organization,
                order: paidOrder,
                orderDisplayItems: CartHelper.getDisplayItems(order.items as Product[]),
                toEmail: paidOrder.customer.email,
                toName: UserHelper.getFullName(paidOrder.customer)
            })

            return stripeSubmitOrderResponse
        }
        catch (error) {
            if (error instanceof ApiErrorResponse) {
                throw error
            }
            throw new ApiErrorResponse(error)
        }
    }

    /**
     * Populates `order.items`.
     * TODO: Just use a mongoose `.populate()` when fetching the order.
     * Warning: No validation is done to ensure that `items` is not already populated.
     * @param {Order} order
     */
    private async _hydrate(order: Order): Promise<Order> {
        if (!order.items ||
            !order.items.length) {
            return order
        }
        const request = new GetCartItemsFromIdsRequest()
        request.ids = [ ...order.items ]
        const refreshResponse = await this.cartService.refresh(request)
        order.items = [ ...refreshResponse.body ]
        return order
    }
}
