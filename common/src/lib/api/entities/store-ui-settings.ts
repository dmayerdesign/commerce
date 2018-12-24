import { arrayProp, schema, MongooseDocument } from '../../goosetype'
import { ProductListFilterUi } from './product-list-filter-ui'

@schema()
export class StoreUiSettings extends MongooseDocument {
    @arrayProp({ type: String }) public orderOfVariableAttributeSelects?: string[]
    @arrayProp({ type: [String] }) public combinedVariableAttributeSelects?: string[][]
    @arrayProp({ type: ProductListFilterUi }) public productListFilterUis?: ProductListFilterUi[]
}
