import { Crud } from '../../constants/crud'
import { Ref } from '../../goosetype'

export class ListRequest {
    public skip? = 0
    public limit? = Crud.Pagination.productsPerPage
    public sortBy? = Crud.Sorting.defaultSortField
    public sortDirection? = Crud.Sorting.defaultSortDirection

    constructor(request?: ListRequest) {
        if (request) {
            if (typeof request.skip !== 'undefined') this.skip = request.skip
            if (typeof request.limit !== 'undefined') this.limit = request.limit
            if (typeof request.sortBy !== 'undefined') this.sortBy = request.sortBy
            if (typeof request.sortDirection !== 'undefined') this.sortDirection = request.sortDirection
        }
    }
}

export class ListFromSearchRequest extends ListRequest {
    public search?: string
    public searchFields?: string[]

    constructor(request?: ListFromSearchRequest) {
        super(request)
        if (request) {
            if (typeof request.search !== 'undefined') this.search = request.search
            if (typeof request.searchFields !== 'undefined') this.searchFields = request.searchFields
        }
    }
}

export class ListFromIdsRequest<T = any> extends ListRequest {
    public ids: string[]|Ref<T>[]
    public readonly limit? = 0

    constructor(request?: ListFromIdsRequest<T>) {
        super(request)
        if (request) {
            if (typeof request.ids !== 'undefined') this.ids = request.ids
        }
    }
}

export class ListFromQueryRequest extends ListRequest {
    public query: object = {}

    constructor(request?: ListFromQueryRequest) {
        super(request)
        if (request) {
            if (typeof request.query !== 'undefined') this.query = request.query
        }
    }
}
