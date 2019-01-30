import { Order } from '@qb/common/domains/order/order'
import * as Stripe from 'stripe'

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
