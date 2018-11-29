import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ProductListFilterComponent } from './product-list/product-list-filter.component'
import { ProductListFiltersComponent } from './product-list/product-list-filters.component'
import { ProductListComponent } from './product-list/product-list.component'

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ProductListComponent,
    ProductListFilterComponent,
    ProductListFiltersComponent,
  ],
})
export class ShopModule { }
