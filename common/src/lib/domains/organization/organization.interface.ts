import { OrganizationType } from '../../constants/enums/organization-type'
import { Entity } from '../data-access/entity.interface'
import { GlobalStyles } from '../global-styles/global-styles.interface'
import { OrganizationBranding } from '../organization-branding/organization-branding.interface'
import { OrganizationRetailSettings } from '../organization-retail-settings/organization-retail-settings.interface'
import { StoreUiSettings } from '../store-ui-settings/store-ui-settings.interface'
import { Taxonomy } from '../taxonomy/taxonomy.interface'
import { UiContent } from '../ui-content/ui-content.interface'

export interface Organization extends Entity {
    id: any
    name: string
    retailSettings: OrganizationRetailSettings
    branding: OrganizationBranding
    storeUrl: string
    storeUiContent: UiContent
    type?: OrganizationType
    dbaNames?: string[]
    blogUiContent?: UiContent
    storeUiSettings?: StoreUiSettings
    searchableTaxonomies?: Taxonomy[]
    globalStyles?: GlobalStyles
    defaultsHaveBeenSet?: boolean
}
