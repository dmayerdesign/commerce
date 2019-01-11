import { Column, CreateDateColumn, Entity, JoinColumn, ObjectIdColumn, ObjectID, OneToMany, UpdateDateColumn } from 'typeorm'
import { OrderStatus } from '../../constants/enums/order-status'
import { Order as IOrder } from '../interfaces/order'
import { Discount } from './discount'
import { EasypostRate } from './easypost-rate'
import { OrderCustomer } from './order-customer'
import { Price } from './price'
import { Product } from './product'
import { StripeCardToken } from './stripe-card-token'

@Entity()
export class Order implements IOrder {
    @ObjectIdColumn() public id: ObjectID

    @OneToMany(() => Product, product => product.id)
    @JoinColumn()
    public products: Product[]

    @Column(() => Price) public subTotal: Price
    @Column(() => Price) public total: Price
    @Column() public taxPercent: number
    @Column() public paymentMethod: string
    @Column({ enum: OrderStatus }) public status: OrderStatus

    @OneToMany(() => Discount, discount => discount.id)
    @JoinColumn()
    public discounts?: Discount[]

    @Column(() => Price) public shippingCost?: Price
    @Column(() => EasypostRate) public shippingRates?: EasypostRate[]
    @Column() public selectedShippingRateId?: string
    @Column() public shippingInsuranceAmt?: number
    @Column() public carrier?: string
    @Column() public trackingCode?: string
    @Column() public estDeliveryDays?: number
    @Column() public postageLabelUrl?: string
    @Column() public savePaymentInfo?: boolean
    @Column() public shipmentId?: string
    @Column() public stripeCardId?: string
    @Column() public stripeOrderId?: string
    @Column() public stripeSource?: string
    @Column(() => StripeCardToken) public stripeToken?: StripeCardToken
    @Column(() => OrderCustomer) public customer?: OrderCustomer
    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
