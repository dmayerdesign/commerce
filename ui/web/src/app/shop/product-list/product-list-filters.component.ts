import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request.interface'
import { ProductListFilterUi } from '@qb/common/domains/product-list-filter-ui/product-list-filter-ui.interface'
import { ProductListFilter } from '@qb/common/domains/product/product-list-filter'
import { Product } from '@qb/common/domains/product/product.interface'

@Component({
  selector: 'product-list-filters',
  template: `
    <ng-container *ngFor="let filter of filters">
      <product-list-filter
        [filter]="filter"
        (filterChange)="handleFilterChange($event)">
      </product-list-filter>
    </ng-container>
  `
})
export class ProductListFiltersComponent {
  @Input() public filters: ProductListFilterUi[]
  @Input() public listRequest: ListRequest<Product>
  @Output() public listRequestChange = new EventEmitter<ListRequest<Product>>()

  public handleFilterChange(productListFilter: ProductListFilter): void {
    const partialRequest: Partial<ListRequest<Product>> = {
      [productListFilter.key as string]: !!productListFilter.range
        ? productListFilter.range
        : productListFilter.values
    }
    this.listRequestChange.emit({
      ...this.listRequest,
      ...partialRequest,
    })
  }
}
