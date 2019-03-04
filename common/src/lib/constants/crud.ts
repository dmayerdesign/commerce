import { SortDirection } from '../constants/enums/sort-direction'

export const Pagination = {
    PRODUCTS_PER_PAGE: 30,
}
export const Sorting = {
    DEFAULT_SORT_FIELD: 'createdAt',
    DEFAULT_SORT_DIRECTION: SortDirection.Descending,
}
export const Params = {
    LIST_REQUEST: 'lr' as 'lr'
}
