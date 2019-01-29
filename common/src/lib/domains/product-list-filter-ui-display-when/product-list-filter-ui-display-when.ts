import { Column } from 'typeorm'
import { ProductListFilterUiDisplayWhen as IProductListFilterUiDisplayWhen } from './product-list-filter-ui-display-when.interface'

export class ProductListFilterUiDisplayWhen implements IProductListFilterUiDisplayWhen {
    @Column() public taxonomyTermSlug: string
}
