import {} from 'stripe'
import * as Stripe from 'stripe'
import { OrderCustomer } from '../api/interfaces/order-customer'
import { Price } from '../api/interfaces/price'
import { OrderStatus } from '../constants/enums/order-status'

export class OrderBuilder {
    public discounts: string[]
    public total: Price
    public taxPercent: number
    public shippingCost: Price
    public shippingRates: any[]
    public selectedShippingRate: any
    public shippingInsuranceAmt: number
    public carrier: string
    public trackingCode: string
    public estDeliveryDays: number
    public postageLabel: any
    public paymentMethod: string
    public savePaymentInfo: boolean
    public shipmentId: string
    public status: OrderStatus
    public stripeCard: Stripe.cards.ICard
    public stripeOrderId: string
    public stripeSource: string
    public stripeToken: string
    public stripeTokenObject: Stripe.tokens.ICardToken
    public customer: OrderCustomer

    constructor(public items: string[]) {
        this.status = OrderStatus.Pending
    }
}
