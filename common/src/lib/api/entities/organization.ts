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
export class Organization {
    @ObjectIdColumn() public id: ObjectID
    @Column({ enum: OrganizationType }) public type?: OrganizationType
    @Column() public name: string
    @OneToMany({ type: String }) public dbaNames: string[]
    @Column() public retailSettings: OrganizationRetailSettings
    @Column() public branding: OrganizationBranding
    @Column() public storeUrl: string
    @Column() public storeUiContent: UiContent
    @Column() public blogUiContent?: UiContent
    @Column() public storeUiSettings?: StoreUiSettings
    @OneToMany({ ref: Taxonomy }) public searchableTaxonomies?: Ref<ITaxonomy>[]
    @Column() public globalStyles?: GlobalStyles
    @Column() public defaultsHaveBeenSet: boolean
}

// Errors.

export class CreateOrganizationError extends Error { }
export class FindOrganizationError extends Error { }
export class UpdateOrganizationError extends Error { }
export class DeleteOrganizationError extends Error { }
