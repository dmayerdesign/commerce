import { OrganizationType } from '../../constants/enums/organization-type'
import { Ref } from '../../goosetype'
import { arrayProp, model, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'
import { Taxonomy as ITaxonomy } from '../interfaces/taxonomy'
import { GlobalStyles } from './global-styles'
import { OrganizationBranding } from './organization-branding'
import { OrganizationRetailSettings } from './organization-retail-settings'
import { StoreUiSettings } from './store-ui-settings'
import { Taxonomy } from './taxonomy'
import { UiContent } from './ui-content'

@model(MongooseSchemaOptions.timestamped)
export class Organization extends MongooseDocument {
    @prop({ enum: OrganizationType }) public type?: OrganizationType
    @prop() public name: string
    @arrayProp({ type: String }) public dbaNames: string[]
    @prop() public retailSettings: OrganizationRetailSettings
    @prop() public branding: OrganizationBranding
    @prop() public storeUrl: string
    @prop() public storeUiContent: UiContent
    @prop() public blogUiContent?: UiContent
    @prop() public storeUiSettings?: StoreUiSettings
    @arrayProp({ ref: Taxonomy }) public searchableTaxonomies?: Ref<ITaxonomy>[]
    @prop() public globalStyles?: GlobalStyles
    @prop() public defaultsHaveBeenSet: boolean
}

// Errors.

export class CreateOrganizationError extends Error { }
export class FindOrganizationError extends Error { }
export class UpdateOrganizationError extends Error { }
export class DeleteOrganizationError extends Error { }
