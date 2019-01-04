import { Column, CreateDateColumn, Entity, JoinColumn, ObjectIdColumn, ObjectID, OneToMany, UpdateDateColumn } from 'typeorm'
import { OrderStatus } from '../../constants/enums/order-status'
import { Discount } from './discount'
import { EasypostRate } from './easypost-rate'
import { OrderCustomer } from './order-customer'
import { Price } from './price'
import { Product } from './product'
import { StripeCardToken } from './stripe-card-token'

@Entity()
export class Order {
    @ObjectIdColumn() public id: ObjectID

    @OneToMany(() => Product, product => product.id)
    @JoinColumn()
    public products: Product[]

    @OneToMany(() => Discount, discount => discount.id)
    @JoinColumn()
    public discounts: Discount[]

    @Column() public subTotal: Price
    @Column() public total: Price
    @Column() public taxPercent: number
    @Column() public shippingCost: Price
    @Column(() => EasypostRate) public shippingRates: EasypostRate[]
    @Column() public selectedShippingRateId: string
    @Column() public shippingInsuranceAmt: number
    @Column() public carrier: string
    @Column() public trackingCode: string
    @Column() public estDeliveryDays: number
    @Column() public postageLabelUrl: string
    @Column() public paymentMethod: string
    @Column() public savePaymentInfo: boolean
    @Column() public shipmentId: string
    @Column({ enum: OrderStatus }) public status: OrderStatus
    @Column() public stripeCardId: string
    @Column() public stripeOrderId: string
    @Column() public stripeSource: string
    @Column() public stripeToken: StripeCardToken
    @Column() public customer: OrderCustomer
    @CreateDateColumn({ type: 'timestamp' }) public createdAt: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt: Date
}
