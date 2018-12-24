import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '**',
    redirectTo: '/', // TODO: Create 404 route.
    pathMatch: 'full'
  }
]
