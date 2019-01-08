import { ObjectID } from 'typeorm'
import { Address } from './address'

export interface OrderCustomer {
    userId: ObjectID
    stripeCustomerId: string
    email: string
    lastName: string
    firstName: string
    shippingAddress: Address
    billingAddress: Address
    savePaymentInfo: boolean
}
