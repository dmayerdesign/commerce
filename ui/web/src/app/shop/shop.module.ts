import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { QbFormsModule } from '@qb/common/modules/forms'
import { QbUiModule } from '@qb/common/modules/ui/ui.module'
import { ProductListFilterComponent } from './product-list/product-list-filter.component'
import { ProductListFiltersComponent } from './product-list/product-list-filters.component'
import { ProductListComponent } from './product-list/product-list.component'
import { ShopComponent } from './shop.component'
import { shopRoutes } from './shop.routes'

@NgModule({
  imports: [
    RouterModule.forChild(shopRoutes),
    CommonModule,
    QbFormsModule,
    QbUiModule,
  ],
  declarations: [
    ProductListComponent,
    ProductListFilterComponent,
    ProductListFiltersComponent,
    ShopComponent,
  ],
})
export class ShopModule { }
