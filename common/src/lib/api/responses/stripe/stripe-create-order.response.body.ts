import * as Stripe from 'stripe'
import { Order } from '../../entities/order'

export class StripeCreateOrderResponseBody {
    public order: Order
    public stripeOrder: Stripe.orders.IOrder
}
