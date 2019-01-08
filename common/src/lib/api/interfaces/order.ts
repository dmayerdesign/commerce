import { OrderStatus } from '../../constants/enums/order-status'
import { Discount } from './discount'
import { EasypostRate } from './easypost-rate'
import { Entity } from './entity'
import { OrderCustomer } from './order-customer'
import { Price } from './price'
import { Product } from './product'
import { StripeCardToken } from './stripe-card-token'

export interface Order extends Entity {
    products: Product[]
    discounts: Discount[]
    subTotal: Price
    total: Price
    taxPercent: number
    shippingCost: Price
    shippingRates: EasypostRate[]
    selectedShippingRateId: string
    shippingInsuranceAmt: number
    carrier: string
    trackingCode: string
    estDeliveryDays: number
    postageLabelUrl: string
    paymentMethod: string
    savePaymentInfo: boolean
    shipmentId: string
    status: OrderStatus
    stripeCardId: string
    stripeOrderId: string
    stripeSource: string
    stripeToken: StripeCardToken
    customer: OrderCustomer
}
