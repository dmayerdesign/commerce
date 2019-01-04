import { Column, ObjectIdColumn, ObjectID } from 'typeorm'
import { Address } from './address'

export class OrderCustomer {
    @ObjectIdColumn() public userId: ObjectID
    @Column() public stripeCustomerId: string
    @Column() public email: string
    @Column() public lastName: string
    @Column() public firstName: string
    @Column() public shippingAddress: Address
    @Column() public billingAddress: Address
    @Column() public savePaymentInfo: boolean
}
