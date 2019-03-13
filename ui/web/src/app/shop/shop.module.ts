import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@qb/common/modules/forms'
import { UiModule } from '@qb/common/modules/ui/ui.module'
import { ProductListFilterComponent } from './product-list/product-list-filter.component'
import { ProductListFiltersComponent } from './product-list/product-list-filters.component'
import { ProductListComponent } from './product-list/product-list.component'
import { ShopHomeCarouselComponent,
  ShopHomeCarouselItemDirective } from './shop-home/shop-home-carousel.component'
import { ShopHomeComponent } from './shop-home/shop-home.component'
import { ShopComponent } from './shop.component'
import { shopRoutes } from './shop.routes'

@NgModule({
  imports: [
    RouterModule.forChild(shopRoutes),
    CommonModule,
    FormsModule,
    UiModule,
  ],
  declarations: [
    ProductListComponent,
    ProductListFilterComponent,
    ProductListFiltersComponent,
    ShopComponent,
    ShopHomeComponent,
    ShopHomeCarouselItemDirective,
    ShopHomeCarouselComponent,
  ],
})
export class ShopModule { }
