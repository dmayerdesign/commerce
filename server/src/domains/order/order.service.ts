import { Inject, Injectable } from '@nestjs/common'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { UpdateManyRequest } from '@qb/common/domains/data-access/requests/update-many.request'
import { ApiErrorResponse } from '@qb/common/domains/data-access/responses/api-error.response'
import { Order } from '@qb/common/domains/order/order'
import { Product } from '@qb/common/domains/product/product'
import { getDisplayProducts } from '@qb/common/helpers/cart.helpers'
import { getFullName } from '@qb/common/helpers/user.helpers'
import { EmailService } from '../email/email.service'
import { StripeOrderService } from '../order/stripe/stripe-order.service'
import { OrganizationService } from '../organization/organization.service'
import { ProductRepository } from '../product/product.repository'
import { ProductService } from '../product/product.service'
import { OrderRepository } from './order.repository'
import { OrderService as IOrderService } from './order.service.interface'

/**
 * TODO:
 * - Create a way to extract useful data from orders
 * -- e.g. Which products did people purchase together?
 * -- Maybe create a `ProductRecommendationData` entity
 * --- { productId: string, purchasedWithProducts: { productId: string, count: number }[] }
 */
@Injectable()
export class OrderService implements IOrderService {

    protected model = Order

    constructor(
        @Inject(OrderRepository) protected _repository: OrderRepository,
        @Inject(ProductRepository) private _productRepository: ProductRepository,
        @Inject(StripeOrderService) private _stripeOrderService: StripeOrderService,
        @Inject(ProductService) private _productService: ProductService,
        @Inject(EmailService) private _emailService: EmailService,
        @Inject(OrganizationService) private _organizationService: OrganizationService,
    ) { }

    public async place(newOrder: Partial<Order>): Promise<Order> {
        try {
            // Hydrate the order (replace the `id`s stored in `order.products` with products).

            const order = await this._hydrate(newOrder) as Order

            // Submit the order.

            const stripeSubmitOrderResponse = await this._stripeOrderService
                .submitOrder(order)

            const paidOrder = await this._hydrate(stripeSubmitOrderResponse.order) as Order
            const parentProducts = await this._productService.getParentProducts(order.products as Product[])
            const allProducts = [ ...order.products as Product[], ...parentProducts ]

            // Update the stock quantity and total sales of each variation and standalone.

            this._productService.updateInventory(allProducts, paidOrder)

            // Set `existsInStripe` asynchronously.

            this._productRepository.updateMany(new UpdateManyRequest<Product>({
                ids: allProducts.map((product) => product.id),
                update: {
                    existsInStripe: true,
                },
            }))

            // Send a receipt.
            if (paidOrder.customer) {
                const organization = await this._organizationService.getOrganization()
                await this._emailService.sendReceipt({
                    organization,
                    order: paidOrder,
                    orderDisplayProducts: getDisplayProducts(order.products as Product[]),
                    toEmail: paidOrder.customer.email,
                    toName: getFullName(paidOrder.customer)
                })
            }

            return paidOrder
        }
        catch (error) {
            if (error instanceof ApiErrorResponse) {
                throw error
            }
            throw new ApiErrorResponse(error)
        }
    }

    /**
     * Populates `order.products`.
     * TODO: Just use a mongoose `.populate()` when fetching the order.
     * Warning: No validation is done to ensure that `products` is not already populated.
     * @param {Order} order
     */
    private async _hydrate(order: Partial<Order>): Promise<Order | Partial<Order>> {
        if (!order.products ||
            !order.products.length) {
            return order
        }
        const request = new ListRequest<Product>({
            ids: order.products.map(({ id }) => id)
        })
        const refreshResponse = await this._productRepository.list(request)
        order.products = refreshResponse
        return order
    }
}
