import { Column } from 'typeorm'
import { ProductListFilterUiDisplayWhen as IProductListFilterUiDisplayWhen } from '../interfaces/product-list-filter-ui-display-when'

export class ProductListFilterUiDisplayWhen implements IProductListFilterUiDisplayWhen {
    @Column() public taxonomyTermSlug: string
}
