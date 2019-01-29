import { Column } from 'typeorm'
import { ProductListFilterUi } from '../product-list-filter-ui/product-list-filter-ui'

export class StoreUiSettings {
    @Column() public orderOfVariableAttributeSelects?: string[]
    @Column() public combinedVariableAttributeSelects?: string[][]
    @Column(() => ProductListFilterUi) public productListFilterUis?: ProductListFilterUi[]
}
