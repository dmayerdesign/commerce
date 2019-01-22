import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Product } from '@qb/common/api/interfaces/product'
import { ProductListFilterUi } from '@qb/common/api/interfaces/product-list-filter-ui'
import { ListRequest } from '@qb/common/api/requests/list.request.interface'

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
