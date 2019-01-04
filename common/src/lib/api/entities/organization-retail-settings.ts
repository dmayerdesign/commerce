import { prop, schema, MongooseDocument } from '../../goosetype'
import { Address } from './address'
import { Price } from './price'

@schema()
export class OrganizationRetailSettings {
    @Column() public shippingAddress: Address
    @Column() public billingAddress: Address
    @Column() public salesTaxPercentage: number
    @Column() public addSalesTax?: boolean
    @Column() public shippingFlatRate?: Price
}
