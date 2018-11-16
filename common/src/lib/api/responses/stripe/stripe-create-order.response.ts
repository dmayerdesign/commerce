import * as Stripe from 'stripe'
import { Order } from '../../entities/order'

export class StripeCreateOrderResponse {
    public order: Order
    public stripeOrder: Stripe.orders.IOrder

    constructor(stripeCreateOrderResponse: StripeCreateOrderResponse) {
        if (stripeCreateOrderResponse) {
            this.order = stripeCreateOrderResponse.order
            this.stripeOrder = stripeCreateOrderResponse.stripeOrder
        }
    }
}
