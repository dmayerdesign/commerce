import { arrayProp, schema, MongooseDocument } from '../../goosetype'
import { StoreUiSettings as IStoreUiSettings } from '../interfaces/store-ui-settings'
import { ProductsFilter } from './products-filter'

@schema()
export class StoreUiSettings extends MongooseDocument implements IStoreUiSettings {
    @arrayProp({ itemsType: String }) public orderOfVariableAttributeSelects?: string[]
    @arrayProp({ itemsType: [String] }) public combinedVariableAttributeSelects?: string[][]
    @arrayProp({ itemsType: ProductsFilter }) public productsFilters?: ProductsFilter[]
}
