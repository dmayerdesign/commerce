import * as Stripe from 'stripe'
import { Order } from '../../entities/order'
import { ApiResponse } from '../api.response'

export class StripeSubmitOrderResponseBody {
    public order: Order
    public stripeOrder: Stripe.orders.IOrder
}

export class StripeSubmitOrderResponse extends ApiResponse<StripeSubmitOrderResponseBody> { }
