import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request.interface'
import { ProductListFilterUi } from '@qb/common/domains/product-list-filter-ui/product-list-filter-ui.interface'
import { Product } from '@qb/common/domains/product/product.interface'

@Component({
  selector: 'product-list-filters',
  template: `
    <product-list-filter *ngFor="let filter of filters"
      [filter]="filter">
    </product-list-filter>
  `
})
export class ProductListFiltersComponent {
  @Input() public filters: ProductListFilterUi[]
  @Input() public listRequest: ListRequest<Product>
  @Output() public listRequestUpdate = new EventEmitter<ListRequest<Product>>()
}
