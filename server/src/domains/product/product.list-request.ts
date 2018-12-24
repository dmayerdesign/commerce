import { Product } from '@qb/common/api/interfaces/product'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { ProductListFilter } from '@qb/common/api/requests/models/product-list-filter'

export class ProductListRequest extends ListRequest<Product> {
    public filters?: ProductListFilter[]

    constructor(request?: ProductListRequest) {
        super(request)
        if (request) {
            if (typeof request.filters !== 'undefined') this.filters = request.filters
        }
    }
}
