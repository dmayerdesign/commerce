import { Document } from '@qb/common/goosetype/interfaces'
import { Address } from './address'
import { Price } from './price'

export interface OrganizationRetailSettings extends Document {
    shippingAddress: Address
    billingAddress: Address
    salesTaxPercentage: number
    addSalesTax?: boolean
    shippingFlatRate?: Price
}
