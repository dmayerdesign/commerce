import { Column } from 'typeorm'
import { Address } from '../address/address'
import { Price } from '../price/price'
import {
    OrganizationRetailSettings as IOrganizationRetailSettings
} from './organization-retail-settings.interface'

export class OrganizationRetailSettings implements IOrganizationRetailSettings {
    @Column(() => Address) public shippingAddress: Address
    @Column(() => Address) public billingAddress: Address
    @Column() public salesTaxPercentage: number
    @Column() public addSalesTax?: boolean
    @Column(() => Price) public shippingFlatRate?: Price
}
