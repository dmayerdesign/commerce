import { arrayProp, prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { CustomRegions } from './custom-regions'
import { NavigationItem } from './navigation-item'

@schema()
export class UiContent extends MongooseDocument {
    @arrayProp({ ref: NavigationItem }) public primaryNavigation: Ref<NavigationItem>[]
    @prop() public customRegions?: CustomRegions
}
