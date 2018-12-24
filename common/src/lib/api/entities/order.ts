import { OrderStatus } from '../../constants/enums/order-status'
import { arrayProp, model, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { Discount as IDiscount } from '../interfaces/discount'
import { Product as IProduct } from '../interfaces/product'
import { Discount } from './discount'
import { EasypostRate } from './easypost-rate'
import { OrderCustomer } from './order-customer'
import { Price } from './price'
import { Product } from './product'
import { StripeCardToken } from './stripe-card-token'

@model(MongooseSchemaOptions.timestamped)
export class Order extends MongooseDocument {
    @arrayProp({ ref: Product }) public items: Ref<IProduct>[]
    @arrayProp({ ref: Discount }) public discounts: Ref<IDiscount>[]
    @prop() public subTotal: Price
    @prop() public total: Price
    @prop() public taxPercent: number
    @prop() public shippingCost: Price
    @arrayProp({ type: EasypostRate }) public shippingRates: EasypostRate[]
    @prop() public selectedShippingRateId: string
    @prop() public shippingInsuranceAmt: number
    @prop() public carrier: string
    @prop() public trackingCode: string
    @prop() public estDeliveryDays: number
    @prop() public postageLabelUrl: string
    @prop() public paymentMethod: string
    @prop() public savePaymentInfo: boolean
    @prop() public shipmentId: string
    @prop({ enum: OrderStatus }) public status: OrderStatus
    @prop() public stripeCardId: string
    @prop() public stripeOrderId: string
    @prop() public stripeSource: string
    @prop() public stripeToken: StripeCardToken
    @prop() public customer: OrderCustomer
}

export class CreateOrderError extends Error { }
export class FindOrderError extends Error { }
export class UpdateOrderError extends Error { }
export class DeleteOrderError extends Error { }
