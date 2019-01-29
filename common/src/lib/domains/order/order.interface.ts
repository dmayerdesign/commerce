import { OrderStatus } from '../../constants/enums/order-status'
import { Entity } from '../data-access/entity.interface'
import { Discount } from '../discount/discount.interface'
import { EasypostRate } from '../easypost-rate/easypost-rate.interface'
import { OrderCustomer } from '../order-customer/order-customer.interface'
import { Price } from '../price/price.interface'
import { Product } from '../product/product.interface'
import { StripeCardToken } from '../stripe-card-token/stripe-card-token.interface'

export interface Order extends Entity {
    products: Product[]
    subTotal: Price
    total: Price
    taxPercent: number
    paymentMethod: string
    status: OrderStatus
    discounts?: Discount[]
    shippingCost?: Price
    shippingRates?: EasypostRate[]
    selectedShippingRateId?: string
    shippingInsuranceAmt?: number
    carrier?: string
    trackingCode?: string
    estDeliveryDays?: number
    postageLabelUrl?: string
    savePaymentInfo?: boolean
    shipmentId?: string
    stripeCardId?: string
    stripeOrderId?: string
    stripeSource?: string
    stripeToken?: StripeCardToken
    customer?: OrderCustomer
}
