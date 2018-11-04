import { ProductsFilterType } from '../../constants/enums/products-filter-type'
import { AttributeValue } from './attribute-value'
import { ProductsFilterDisplayWhen } from './products-filter-display-when'
import { Ref } from './ref'
import { SimpleAttributeValue } from './simple-attribute-value'
import { TaxonomyTerm } from './taxonomy-term'

export interface ProductsFilter {
    filterType: ProductsFilterType
    enabled: boolean
    displayAlways?: boolean
    displayWhen?: ProductsFilterDisplayWhen
    label?: string
    taxonomyTermOptions?: Ref<TaxonomyTerm>[]
    attributeValueOptions?: (Ref<AttributeValue> | SimpleAttributeValue)[]
}
