import { Product } from '@qb/common/api/interfaces/product'
import { ListRequest } from '@qb/common/api/requests/list.request'

export enum ProductListFilterType {
    Property,
    AttributeValue,
    SimpleAttributeValue,
    TaxonomyTerm,
}

export interface ProductListFilter {
    type: ProductListFilterType
    key?: string
    values?: any[]
    range?: {
        min: number
        max: number
    }
}

export class ProductListRequest extends ListRequest<Product> {
    public filters?: ProductListFilter[]

    constructor(request?: ProductListRequest) {
        super(request)
        if (request) {
            if (typeof request.filters !== 'undefined') this.filters = request.filters
        }
    }
}
