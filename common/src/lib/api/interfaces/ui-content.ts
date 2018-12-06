import { CustomRegions } from './custom-regions'
import { Document } from './document'
import { NavigationItem } from './navigation-item'
import { Ref } from './ref'

export interface UiContent extends Document {
    primaryNavigation: Ref<NavigationItem>[]
    customRegions?: CustomRegions
}
