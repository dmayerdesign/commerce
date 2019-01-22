import { SortDirection } from '../../constants/enums/sort-direction'

export interface ListRequest<EntityType = any> {
  skip?: number
  limit?: number
  sortBy?: keyof EntityType
  sortDirection?: SortDirection
  query?: object
  ids?: any[]
  search?: string
  searchFields?: string[]
}
