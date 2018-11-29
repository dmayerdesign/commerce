import { TaxonomyTerm } from '@qb/common/api/entities/taxonomy-term'
import { GetProductsRequest } from '@qb/common/api/requests/get-products.request'
import { QbFormBuilder } from '@qb/common/modules/forms/utilities/form.builder'

export interface ShopState {
  getProductsRequest: GetProductsRequest
  productsFilterFormBuilders: QbFormBuilder[]
  taxonomyTerm: TaxonomyTerm
}

export const initialShopState: ShopState = {
  getProductsRequest: {},
  productsFilterFormBuilders: [],
  taxonomyTerm: null,
}
