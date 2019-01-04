import { Column } from 'typeorm';

// Brand colors.

export class OrganizationBrandingColors {
    @Column() public primary: string
}

// Branding.

export class OrganizationBranding {
    @Column() public displayName: string
    @Column() public logo: string
    @Column() public colors: OrganizationBrandingColors
    @Column() public cartName: string
}
