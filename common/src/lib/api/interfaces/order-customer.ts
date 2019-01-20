import { Address } from './address'

export interface OrderCustomer {
    userId: string
    stripeCustomerId: string
    email: string
    lastName: string
    firstName: string
    shippingAddress: Address
    billingAddress: Address
    savePaymentInfo: boolean
}
