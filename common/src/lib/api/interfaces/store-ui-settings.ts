import { MongooseDocument } from './mongoose-document'
import { ProductsFilter } from './products-filter'

export interface StoreUiSettings extends MongooseDocument {
    orderOfVariableAttributeSelects?: string[]
    combinedVariableAttributeSelects?: string[][]
    productsFilters?: ProductsFilter[]
}
