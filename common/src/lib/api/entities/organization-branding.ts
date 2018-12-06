import { prop, schema, MongooseDocument } from '../../goosetype'

// Brand colors.

@schema()
export class OrganizationBrandingColors extends MongooseDocument {
    @prop() public primary: string
}

// Branding.

@schema()
export class OrganizationBranding extends MongooseDocument {
    @prop() public displayName: string
    @prop() public logo: string
    @prop() public colors: OrganizationBrandingColors
    @prop() public cartName: string
}
