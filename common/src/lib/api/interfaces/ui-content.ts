import { CustomRegions } from './custom-regions'
import { MongooseDocument } from './mongoose-document'
import { NavigationItem } from './navigation-item'
import { Ref } from './ref'

export interface UiContent extends MongooseDocument {
    primaryNavigation: Ref<NavigationItem>[]
    customRegions?: CustomRegions
}
