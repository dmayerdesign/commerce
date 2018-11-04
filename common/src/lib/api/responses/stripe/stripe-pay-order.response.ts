import * as Stripe from 'stripe'
import { Order } from '../../entities/order'
import { ApiResponse } from '../api.response'

export class StripePayOrderResponseBody {
    public paidOrder: Order
    public paidStripeOrder: Stripe.orders.IOrder
}

export class StripePayOrderResponse extends ApiResponse<StripePayOrderResponseBody> { }
