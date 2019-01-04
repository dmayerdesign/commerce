import { arrayProp, schema, MongooseDocument } from '../../goosetype'
import { ProductListFilterUi } from './product-list-filter-ui'

@schema()
export class StoreUiSettings {
    @OneToMany({ type: String }) public orderOfVariableAttributeSelects?: string[]
    @OneToMany({ type: [String] }) public combinedVariableAttributeSelects?: string[][]
    @OneToMany({ type: ProductListFilterUi }) public productListFilterUis?: ProductListFilterUi[]
}
