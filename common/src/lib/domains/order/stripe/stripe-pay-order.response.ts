import { Order } from '@qb/common/domains/order/order'
import * as Stripe from 'stripe'

export class StripePayOrderResponse {
    public paidOrder: Order
    public paidStripeOrder: Stripe.orders.IOrder

    constructor(stripePayOrderResponse: StripePayOrderResponse) {
        if (stripePayOrderResponse) {
            this.paidOrder = stripePayOrderResponse.paidOrder
            this.paidStripeOrder = stripePayOrderResponse.paidStripeOrder
        }
    }
}
