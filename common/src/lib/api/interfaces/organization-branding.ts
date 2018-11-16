import { Document } from '@qb/common/goosetype/interfaces'

// Brand colors.

export interface OrganizationBrandingColors extends Document {
    primary: string
}

// Branding.

export interface OrganizationBranding extends Document {
    displayName: string
    logo: string
    colors: OrganizationBrandingColors
    cartName: string
}
