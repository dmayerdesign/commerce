import { Column } from 'typeorm'
import { OrganizationRetailSettings as IOrganizationRetailSettings } from '../interfaces/organization-retail-settings'
import { Address } from './address'
import { Price } from './price'

export class OrganizationRetailSettings implements IOrganizationRetailSettings {
    @Column() public shippingAddress: Address
    @Column() public billingAddress: Address
    @Column() public salesTaxPercentage: number
    @Column() public addSalesTax?: boolean
    @Column() public shippingFlatRate?: Price
}
