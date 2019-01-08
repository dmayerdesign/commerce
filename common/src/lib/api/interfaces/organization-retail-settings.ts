import { Address } from './address'
import { Price } from './price'

export interface OrganizationRetailSettings {
    shippingAddress: Address
    billingAddress: Address
    salesTaxPercentage: number
    addSalesTax?: boolean
    shippingFlatRate?: Price
}
