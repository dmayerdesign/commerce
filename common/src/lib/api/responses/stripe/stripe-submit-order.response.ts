import * as Stripe from 'stripe'
import { Order } from '../../interfaces/order'

export class StripeSubmitOrderResponse {
    public order: Order
    public stripeOrder: Stripe.orders.IOrder

    constructor(stripeSubmitOrderResponse: StripeSubmitOrderResponse) {
        if (stripeSubmitOrderResponse) {
            this.order = stripeSubmitOrderResponse.order
            this.stripeOrder = stripeSubmitOrderResponse.stripeOrder
        }
    }
}
