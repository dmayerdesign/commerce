import { MongooseDocument } from './mongoose-document'

// Brand colors.

export interface OrganizationBrandingColors extends MongooseDocument {
    primary: string
}

// Branding.

export interface OrganizationBranding extends MongooseDocument {
    displayName: string
    logo: string
    colors: OrganizationBrandingColors
    cartName: string
}
