import * as Stripe from 'stripe'
import { Order } from '../../entities/order'

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
