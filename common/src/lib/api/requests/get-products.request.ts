import { Product } from '../interfaces/product'
import { ListRequest } from './list.request'

export enum GetProductsFilterType {
    Property,
    AttributeValue,
    SimpleAttributeValue,
    TaxonomyTerm,
}

export interface GetProductsFilter {
    type: GetProductsFilterType
    key?: string
    values?: any[]
    range?: {
        min: number
        max: number
    }
}

export class GetProductsRequest extends ListRequest<Product> {
    public filters?: GetProductsFilter[]

    constructor(request?: GetProductsRequest) {
        super(request)
        if (request) {
            if (typeof request.filters !== 'undefined') this.filters = request.filters
        }
    }
}
