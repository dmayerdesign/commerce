import { Address } from './address'
import { MongooseDocument } from './mongoose-document'
import { Price } from './price'

export interface OrganizationRetailSettings extends MongooseDocument {
    shippingAddress: Address
    billingAddress: Address
    salesTaxPercentage: number
    addSalesTax?: boolean
    shippingFlatRate?: Price
}
