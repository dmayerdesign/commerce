import { Document } from '@qb/common/goosetype/interfaces'
import { Address } from './address'

export interface OrderCustomer extends Document {
    userId: string
    stripeCustomerId: string
    email: string
    lastName: string
    firstName: string
    shippingAddress: Address
    billingAddress: Address
    savePaymentInfo: boolean
}
