import { Inject, Injectable } from '@nestjs/common'
import { Copy } from '@qb/common/constants/copy'
import { OrderStatus } from '@qb/common/constants/enums/order-status'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import { Discount } from '@qb/common/domains/discount/discount'
import { Order } from '@qb/common/domains/order/order'
import { StripeCreateOrderResponse } from '@qb/common/domains/order/stripe/stripe-create-order.response'
import { StripePayOrderResponse } from '@qb/common/domains/order/stripe/stripe-pay-order.response'
import { Product } from '@qb/common/domains/product/product'
import { StripeOrder } from '@qb/common/stripe-shims/stripe-order'
import { environment } from '@qb/environment-vars'
import * as Stripe from 'stripe'
import { DiscountRepository } from '../../discount/discount.repository'
import { OrganizationService } from '../../organization/organization.service'
import { ProductListRequest } from '../../product/product.list-request'
import { ProductRepository } from '../../product/product.repository'
import { getSubTotal, getTotal } from '../order.helpers'
import { OrderRepository } from '../order.repository'

const stripe = new Stripe(environment().STRIPE_SECRET_KEY as string)

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
    @Inject(DiscountRepository) private _discountRepository: DiscountRepository,
    @Inject(OrderRepository) private _orderRepository: OrderRepository,
    @Inject(ProductRepository) private _productRepository: ProductRepository,
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
    let orderProducts: Product[]
    let orderDiscounts: Discount[]

    if (!order.total
      || !order.total.currency
      || !order.customer
      || !order.customer.email) {
      throw new Error(Copy.ErrorMessages.invalidOrder)
    }

    order.subTotal.amount = 0
    order.total.amount = 0

    try {
      const organization = await this.organizationService.getOrganization()
      const orderProductsRequest = new ProductListRequest()
      orderProductsRequest.ids = order.products.map((product) => product.id)
      orderProducts = await this._productRepository.list(orderProductsRequest)
      order.subTotal = getSubTotal(orderProducts)
      order.total = getTotal(
        order.subTotal,
        organization.retailSettings.addSalesTax as boolean,
        organization.retailSettings.salesTaxPercentage
      )
    }
    catch (getProductsError) {
      throw getProductsError
    }

    if (order.discounts && order.discounts.length) {
      try {
        const orderDiscountsRequest = new ListRequest({
          ids: order.discounts.map((discount) => discount.id),
          limit: 0
        })
        orderDiscounts = await this._discountRepository.list(orderDiscountsRequest)
        orderDiscounts.forEach(orderDiscount => {
          order.total.amount -= orderDiscount.total.amount
        })
      }
      catch (getDiscountsError) {
        throw getDiscountsError
      }
    }

    const dbOrder = this._orderRepository.create(order)

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
    stripeOrder.items = orderProducts.map((product) => {
      return {
        type: 'sku' as 'sku',
        parent: product.sku, // Note: this does NOT mean "parent product". "Parent" here
          // means "ID of the product associated with this OrderItemCreationHash".
          // (We're using skus as IDs)
        quantity: 1,
      }
    })

    // The `StripeOrder` prototype needs to be erased, because that's the way `stripe` needs it
    // (which is absolutely ridiculous).
    const stripeOrderData = Object.assign({}, stripeOrder)
    const newStripeOrder = await stripe.orders.create(stripeOrderData)
    dbOrder.stripeOrderId = newStripeOrder.id
    const newOrder = await this._orderRepository.insert(dbOrder)
    return new StripeCreateOrderResponse({
      order: newOrder,
      stripeOrder: newStripeOrder,
    })
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
        orderID: order.id.toString(),
      },
    }

    if (
      order.customer &&
      order.customer.stripeCustomerId &&
      !order.stripeToken &&
      !order.stripeCardId
    ) {
      payment.customer = order.customer.stripeCustomerId
    }
    else if (
      (order.stripeToken || order.stripeCardId) &&
      order.customer &&
      order.customer.email
    ) {
      payment.source = order.stripeToken
        ? order.stripeToken.id
        : order.stripeCardId
      payment.email = order.customer ? order.customer.email : undefined
    }
    else {
      throw new Error(
        'Missing one of: Stripe Customer ID, Stripe Token ID, or email'
      )
    }

    if (
      order.savePaymentInfo &&
      order.stripeToken &&
      order.customer.stripeCustomerId
    ) {
      delete payment.source
      delete payment.email
      payment.customer = order.customer.stripeCustomerId

      try {
        const card = await stripe.customers.createSource(
          order.customer.stripeCustomerId,
          { source: order.stripeToken.id }
        )
        if (!card) {
          throw new Error('Couldn\'t save your payment info. Please try again.')
        }
        await stripe.customers.update(order.customer.stripeCustomerId, {
          default_source: card.id
        })
      }
      catch (error) {
        throw error
      }
    }

    // Make the payment.

    const paidStripeOrder = await stripe.orders.pay(
      order.stripeOrderId as string,
      payment,
      { idempotency_key: order.id.toString() }
    )
    const unpaidDbOrder = await this._orderRepository.get(order.id) as Order
    const paidOrder = await this._orderRepository.update(
      new UpdateRequest<Order>({
        id: unpaidDbOrder.id,
        update: {
          status: OrderStatus.Paid
        }
      })
    )
    return new StripePayOrderResponse({
      paidOrder,
      paidStripeOrder,
    })
  }
}
