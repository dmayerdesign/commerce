import * as Stripe from 'stripe'
import { Order } from '../../entities/order'

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
