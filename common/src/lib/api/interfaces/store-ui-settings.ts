import { Document } from './document'
import { ProductsFilter } from './products-filter'

export interface StoreUiSettings extends Document {
    orderOfVariableAttributeSelects?: string[]
    combinedVariableAttributeSelects?: string[][]
    productsFilters?: ProductsFilter[]
}
