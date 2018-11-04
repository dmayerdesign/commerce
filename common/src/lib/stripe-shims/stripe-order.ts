import * as Stripe from 'stripe'

export class StripeOrder implements Stripe.orders.IOrderCreationOptions { // implements Stripe.orders.IOrder {
    /**
     * Value is "order"
     */
    public object: 'order'
    public id: string

    /**
     * A positive integer in the smallest currency unit (that is, 100 cents for $1.00, or 1 for ¥1, Japanese Yen being a 0-decimal
     * currency) representing the total amount for the order.
     */
    public amount: number

    /**
     * ID of the Connect Application that created the order.
     */
    public application: string

    public application_fee: number

    /**
     * The ID of the payment used to pay for the order. Present if the order status is paid, fulfilled, or refunded. [Expandable]
     */
    public charge: string | Stripe.charges.ICharge

    public created: number

    /**
     * 3-letter ISO code representing the currency in which the order was made.
     */
    public currency: string

    /**
     * The customer used for the order. [Expandable]
     */
    public customer: string

    /**
     * The email address of the customer placing the order.
     */
    public email: string

    public external_coupon_code: string

    /**
     * List of items constituting the order.
     */
    public items: Stripe.orders.IOrderItemCreationHash[] = []

    public livemode: boolean
    public metadata: Stripe.IMetadata

    /**
     * The shipping method that is currently selected for this order, if any. If present, it is equal to one of the ids of shipping methods
     * in the shipping_methods array. At order creation time, if there are multiple shipping methods, Stripe will automatically selected
     * the first method.
     */
    public selected_shipping_method: string

    /**
     * The shipping address for the order. Present if the order is for goods to be shipped.
     */
    public shipping: Stripe.IShippingInformation

    /**
     * A list of supported shipping methods for this order. The desired shipping method can be specified either by updating the order, or
     * when paying it.
     */
    public shipping_methods: Array<Stripe.orders.IShippingMethod> = []

    public status: Stripe.orders.OrderStatus

    /**
     * The timestamps at which the order status was updated
     */
    public status_transitions: {
        canceled: number;
        fulfiled: number;
        paid: number;
        returned: number;
    }
    public status_transactions?: undefined // Accommodate type-o in @types/stripe

    public updated: number
}
