import { Column } from 'typeorm'
import {
    OrganizationBranding as IOrganizationBranding,
    OrganizationBrandingColors as IOrganizationBrandingColors
} from '../interfaces/organization-branding'

export class OrganizationBrandingColors implements IOrganizationBrandingColors {
    @Column() public primary: string
}

export class OrganizationBranding implements IOrganizationBranding {
    @Column() public displayName: string
    @Column() public logo: string
    @Column() public colors: OrganizationBrandingColors
    @Column() public cartName: string
}
