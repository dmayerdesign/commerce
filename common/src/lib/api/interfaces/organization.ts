import { OrganizationType } from '../../constants/enums/organization-type'
import { Entity } from './entity'
import { GlobalStyles } from './global-styles'
import { OrganizationBranding } from './organization-branding'
import { OrganizationRetailSettings } from './organization-retail-settings'
import { StoreUiSettings } from './store-ui-settings'
import { Taxonomy } from './taxonomy'
import { UiContent } from './ui-content'

export interface Organization extends Entity {
    type?: OrganizationType
    name: string
    dbaNames: string[]
    retailSettings: OrganizationRetailSettings
    branding: OrganizationBranding
    storeUrl: string
    storeUiContent: UiContent
    blogUiContent?: UiContent
    storeUiSettings?: StoreUiSettings
    searchableTaxonomies?: Taxonomy[]
    globalStyles?: GlobalStyles
    defaultsHaveBeenSet: boolean
}
