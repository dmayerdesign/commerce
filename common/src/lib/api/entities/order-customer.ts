import { prop, schema, MongooseDocument } from '../../goosetype'
import { Address } from './address'

@schema(OrderCustomer)
export class OrderCustomer extends MongooseDocument {
    @prop() public userId: string
    @prop() public stripeCustomerId: string
    @prop() public email: string
    @prop() public lastName: string
    @prop() public firstName: string
    @prop() public shippingAddress: Address
    @prop() public billingAddress: Address
    @prop() public savePaymentInfo: boolean
}
