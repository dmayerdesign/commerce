import { Address } from './address'
import { MongooseDocument } from './mongoose-document'

export interface OrderCustomer extends MongooseDocument {
    userId: string
    stripeCustomerId: string
    email: string
    lastName: string
    firstName: string
    shippingAddress: Address
    billingAddress: Address
    savePaymentInfo: boolean
}
