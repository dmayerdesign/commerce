import { Document } from 'mongoose'
import { OrganizationType } from '../../constants/enums/organization-type'
import { GlobalStyles } from './global-styles'
import { OrganizationBranding } from './organization-branding'
import { OrganizationRetailSettings } from './organization-retail-settings'
import { Ref } from './ref'
import { StoreUiSettings } from './store-ui-settings'
import { Taxonomy } from './taxonomy'
import { UiContent } from './ui-content'

export interface Organization extends Document {
    type?: OrganizationType
    name: string
    dbaNames: string[]
    retailSettings: OrganizationRetailSettings
    branding: OrganizationBranding
    storeUrl: string
    storeUiContent: UiContent
    blogUiContent?: UiContent
    storeUiSettings?: StoreUiSettings
    searchableTaxonomies?: Ref<Taxonomy>[]
    globalStyles?: GlobalStyles
    defaultsHaveBeenSet: boolean
}
