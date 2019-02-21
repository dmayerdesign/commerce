import { Component } from '@angular/core'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request.interface'
import { ProductListFilterUi } from '@qb/common/domains/product-list-filter-ui/product-list-filter-ui.interface'
import { Product } from '@qb/common/domains/product/product.interface'
import { StoreUiSettings } from '@qb/common/domains/store-ui-settings/store-ui-settings.interface'
import { ProductDataService } from '@qb/generated/ui/data-services.generated'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { OrganizationService } from '../../organization/organization.service'

@Component({
  selector: 'product-list',
  template: `
    <product-list-filters
      [filters]="filters$ | async"
      [listRequest]="listRequest"
      (listRequestChange)="handleListRequestChange($event)">
    </product-list-filters>
  `
})
export class ProductListComponent {
  public listRequest: ListRequest<Product>
  public products: Product[] = []
  public filters$: Observable<ProductListFilterUi[] | undefined>

  constructor(
    private _productDataService: ProductDataService,
    private _organizationService: OrganizationService,
  ) {
    this.filters$ = this._organizationService.organization$.pipe(
      map(({ storeUiSettings }) =>
        (storeUiSettings as StoreUiSettings).productListFilterUis
      )
    )
  }

  public async handleListRequestChange(listRequest: ListRequest<Product>): Promise<void> {
    this.listRequest = listRequest
    this.products = await this._productDataService.list(listRequest)
  }
}
