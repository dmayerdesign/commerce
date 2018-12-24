import { Document } from './document'
import { ProductListFilterUi } from './product-list-filter-ui'

export interface StoreUiSettings extends Document {
    orderOfVariableAttributeSelects?: string[]
    combinedVariableAttributeSelects?: string[][]
    productListFilterUis?: ProductListFilterUi[]
}
