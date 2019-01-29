import { Column } from 'typeorm'
import { Address } from '../address/address'
import { OrderCustomer as IOrderCustomer } from './order-customer.interface'

export class OrderCustomer implements IOrderCustomer {
    @Column() public userId: string
    @Column() public stripeCustomerId: string
    @Column() public email: string
    @Column() public lastName: string
    @Column() public firstName: string
    @Column(() => Address) public shippingAddress: Address
    @Column(() => Address) public billingAddress: Address
    @Column() public savePaymentInfo: boolean
}
