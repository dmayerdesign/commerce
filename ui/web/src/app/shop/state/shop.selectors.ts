import { createFeatureSelector, createSelector, select } from '@ngrx/store'
import { AppState } from '../state/app.state'
import { ShopState } from './shop.state'

export const shopSelectorKey = 'shop'

export const shopSelector = createFeatureSelector<AppState, ShopState>(
    shopSelectorKey,
)

export const getProductsRequestSelector = createSelector(
    shopSelector,
    (productsState) => productsState.getProductsRequest
)

export const selectShop = select(shopSelector)
export const selectGetProductsRequest = select(getProductsRequestSelector)

