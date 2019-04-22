import { Routes } from '@angular/router'
import { ProductListComponent } from './product-list/product-list.component'
import { ShopHomeComponent } from './shop-home/shop-home.component'
import { ShopComponent } from './shop.component'

export const shopRoutes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      {
        path: '',
        component: ShopHomeComponent,
      },
      {
        path: 'products',
        component: ProductListComponent
      }
    ],
  },
]
