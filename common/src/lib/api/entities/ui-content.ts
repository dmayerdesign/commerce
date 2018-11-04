import { arrayProp, prop, schema, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { UiContent as IUiContent } from '../interfaces/ui-content'
import { CustomRegions } from './custom-regions'
import { NavigationItem } from './navigation-item'

@schema(UiContent)
export class UiContent extends MongooseDocument implements IUiContent {
    @arrayProp({ itemsRef: NavigationItem }) public primaryNavigation: Ref<NavigationItem>[]
    @prop() public customRegions?: CustomRegions
}
