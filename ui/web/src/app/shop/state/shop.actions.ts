import { Type } from '@angular/core'
import { ParamMap } from '@angular/router'
import { TaxonomyTerm } from '@qb/common/api/interfaces/taxonomy-term'
import { GetProductsRequest } from '@qb/common/api/requests/get-products.request'
import { NgrxAction, NgrxMessage } from '@qb/common/models/ui/ngrx-action'
import { QbFormBuilder } from '@qb/common/modules/forms/utilities/form.builder'
import { filter } from 'rxjs/operators'

export function filterByType<ActionType extends NgrxAction>(actionType: Type<ActionType>) {
  return filter<ActionType>((shopAction) => shopAction instanceof actionType)
}

export abstract class ShopAction<PayloadType = any> extends NgrxMessage<PayloadType> { }
export abstract class ShopActionSansPayload extends NgrxAction { }

export class GetProductsRequestUpdate extends ShopAction<GetProductsRequest> {
  public type = 'Update the GetProductsRequest'
}

export class GetProductsSuccess extends ShopAction<void> {
  public type = 'Report the success of GetProducts'
}

export class ProductsFilterFormBuildersUpdate extends
  ShopAction<QbFormBuilder[]> {
  public type = 'Update the products filter form builders'
}

export class TaxonomyTermInViewUpdate extends ShopAction<string> {
  public type = 'Update the taxonomy term slug representing the products being viewed'
}

export class TaxonomyTermInViewUpdateSuccess extends ShopAction<TaxonomyTerm> {
  public type = 'Update the taxonomy term representing the products being viewed'
}

export class ProductsFilterFormsReset extends ShopAction<void> {
  public type = 'Reset the form values for each products filter'
}

export class RequestCreationFromParamMaps extends ShopAction<{ queryParamMap: ParamMap, routeParamMap: ParamMap }> {
  public type = 'Create a request from a map of query params and a map of route params'
}
