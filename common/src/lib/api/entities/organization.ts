import { OrganizationType } from '../../constants/enums/organization-type'
import { arrayProp, model, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'
import { Ref } from '../../goosetype'
import { Organization as IOrganization } from '../interfaces/organization'
import { GlobalStyles } from './global-styles'
import { OrganizationBranding } from './organization-branding'
import { OrganizationRetailSettings } from './organization-retail-settings'
import { StoreUiSettings } from './store-ui-settings'
import { Taxonomy } from './taxonomy'
import { UiContent } from './ui-content'

@model(Organization, MongooseSchemaOptions.timestamped)
export class Organization extends MongooseDocument implements IOrganization {
    @prop({ enum: OrganizationType }) public type?: OrganizationType
    @prop() public name: string
    @arrayProp({ itemsType: String }) public dbaNames: string[]
    @prop() public retailSettings: OrganizationRetailSettings
    @prop() public branding: OrganizationBranding
    @prop() public storeUrl: string
    @prop() public storeUiContent: UiContent
    @prop() public blogUiContent?: UiContent
    @prop() public storeUiSettings?: StoreUiSettings
    @arrayProp({ itemsRef: Taxonomy }) public searchableTaxonomies?: Ref<Taxonomy>[]
    @prop() public globalStyles?: GlobalStyles
    @prop() public defaultsHaveBeenSet: boolean
}

// Errors.

export class CreateOrganizationError extends Error { }
export class FindOrganizationError extends Error { }
export class UpdateOrganizationError extends Error { }
export class DeleteOrganizationError extends Error { }
