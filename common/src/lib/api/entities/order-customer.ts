import { Column, ObjectIdColumn, ObjectID } from 'typeorm'
import { OrderCustomer as IOrderCustomer } from '../interfaces/order-customer'
import { Address } from './address'

export class OrderCustomer implements IOrderCustomer {
    @ObjectIdColumn() public userId: ObjectID
    @Column() public stripeCustomerId: string
    @Column() public email: string
    @Column() public lastName: string
    @Column() public firstName: string
    @Column(() => Address) public shippingAddress: Address
    @Column(() => Address) public billingAddress: Address
    @Column() public savePaymentInfo: boolean
}
