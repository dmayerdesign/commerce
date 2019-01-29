import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { ProductListFilter } from '@qb/common/domains/product/product-list-filter'
import { Product } from '@qb/common/domains/product/product.interface'

export class ProductListRequest extends ListRequest<Product> {
    public filters?: ProductListFilter[]

    constructor(request?: ProductListRequest) {
        super(request)
        if (request) {
            if (typeof request.filters !== 'undefined') this.filters = request.filters
        }
    }
}
