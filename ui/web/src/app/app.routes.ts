import { Routes } from '@angular/router'
import { NotFoundComponent } from './not-found/not-found.component'

export const appRoutes: Routes = [
  {
    path: 'shop',
    loadChildren: './shop/shop.module#ShopModule',
  },
  {
    path: '',
    redirectTo: '/shop',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
]
