import { arrayProp, prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { CustomRegions } from './custom-regions'
import { NavigationItem } from './navigation-item'

@schema()
export class UiContent {
    @OneToMany({ ref: NavigationItem }) public primaryNavigation: Ref<NavigationItem>[]
    @Column() public customRegions?: CustomRegions
}
