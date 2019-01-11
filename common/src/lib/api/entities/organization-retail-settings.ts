import { Column } from 'typeorm'
import { OrganizationRetailSettings as IOrganizationRetailSettings } from '../interfaces/organization-retail-settings'
import { Address } from './address'
import { Price } from './price'

export class OrganizationRetailSettings implements IOrganizationRetailSettings {
    @Column(() => Address) public shippingAddress: Address
    @Column(() => Address) public billingAddress: Address
    @Column() public salesTaxPercentage: number
    @Column() public addSalesTax?: boolean
    @Column(() => Price) public shippingFlatRate?: Price
}
