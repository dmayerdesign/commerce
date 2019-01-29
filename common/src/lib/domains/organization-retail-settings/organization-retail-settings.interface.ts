import { Address } from '../address/address.interface'
import { Price } from '../price/price.interface'

export interface OrganizationRetailSettings {
    shippingAddress: Address
    billingAddress: Address
    salesTaxPercentage: number
    addSalesTax?: boolean
    shippingFlatRate?: Price
}
