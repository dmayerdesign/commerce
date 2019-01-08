import { ProductListFilterUi } from './product-list-filter-ui'

export interface StoreUiSettings {
    orderOfVariableAttributeSelects?: string[]
    combinedVariableAttributeSelects?: string[][]
    productListFilterUis?: ProductListFilterUi[]
}
