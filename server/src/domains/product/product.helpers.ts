import { ProductListFilter } from '@qb/common/api/requests/models/product-list-filter'
import { RangeLimit } from '@qb/common/constants/enums/range-limit'
import { queryWithAndOperation } from '@qb/common/helpers/mongoose.helpers'
import { cloneDeep } from 'lodash'

export function propertyFilter(filter: ProductListFilter, query: typeof queryWithAndOperation): typeof queryWithAndOperation {
  const newQuery = cloneDeep(query)
  if (filter.values && filter.values.length) {
    const propertyVOs = filter.values.map(val => {
      return {
        [filter.key]: val
      }
    })
    newQuery.$and.push({ $or: propertyVOs })
  }
  if (filter.range) {
    let lowerLimit, upperLimit
    lowerLimit = {
      [`${filter.key}.amount`]: { $gte: filter.range[RangeLimit.Min] },
    }
    upperLimit = {
      [`${filter.key}.amount`]: { $lte: filter.range[RangeLimit.Max] },
    }

    newQuery.$and = newQuery.$and.concat([lowerLimit, upperLimit])
  }

  return newQuery
}

export function simpleAttributeValueFilter(filter: ProductListFilter, query: typeof queryWithAndOperation): typeof queryWithAndOperation {
    const newQuery = cloneDeep(query)
    let attributeVOs: { value: any }[] = []

    if (filter.values && filter.values.length) {
        attributeVOs = filter.values.map(attributeValue => {
            return { value: attributeValue }
        })
        newQuery.$and.push({
            $or: [
                {
                    simpleAttributeValues: {
                        $elemMatch: {
                            attribute: filter.key,
                            $or: attributeVOs,
                        },
                    },
                },
                {
                    variableSimpleAttributeValues: {
                        $elemMatch: {
                            attribute: filter.key,
                            $or: attributeVOs,
                        },
                    },
                },
            ],
        })
    }
    if (filter.range) {
        const lowerLimit: any = {
            [filter.key]: {
                value: { $gte: filter.range[RangeLimit.Min] },
            }
        }
        const upperLimit: any = {
            [filter.key]: {
                value: { $lte: filter.range[RangeLimit.Max] },
            }
        }

        attributeVOs = [lowerLimit, upperLimit]

        newQuery.$and.push({
            $or: [
                {
                    simpleAttributeValues: {
                        $elemMatch: {
                            attribute: filter.key,
                            $and: attributeVOs,
                        },
                    },
                },
                {
                    variableSimpleAttributeValues: {
                        $elemMatch: {
                            attribute: filter.key,
                            $and: attributeVOs,
                        },
                    },
                },
            ],
        })
    }
    return newQuery
}

export function attributeValueFilter(filter: ProductListFilter, query: typeof queryWithAndOperation): typeof queryWithAndOperation {
    const newQuery = cloneDeep(query)
    const ids = filter.values

    if (ids && ids.length) {
        newQuery.$and.push({
            $or: [
                { attributeValues: { $in: ids } },
                { variableAttributeValues: { $in: ids } },
            ],
        })
    }

    return newQuery
}

// Note: Parents and variations must share the same taxonomy terms.
// TODO: Should be deriving a variation's taxonomy terms from its parent.
export function taxonomyTermFilter(ids: string[], query: typeof queryWithAndOperation): typeof queryWithAndOperation {
    const newQuery = cloneDeep(query)

    if (ids && ids.length) {
        newQuery.$and.push({
            taxonomyTerms: { $in: ids },
        })
    }

    return newQuery
}
