import { Routes } from '@angular/router'

export const appRoutes: Routes = [
  {
    path: 'shop',
    loadChildren: './shop/shop.module#ShopModule',
  },
  {
    path: '',
    redirectTo: '/shop',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/', // TODO: Create 404 route.
    pathMatch: 'full',
  },
]
