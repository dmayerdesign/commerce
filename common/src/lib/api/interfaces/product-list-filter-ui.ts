import { ProductListFilterType } from '../requests/models/product-list-filter'
import { AttributeValue } from './attribute-value'
import { ProductListFilterUiDisplayWhen } from './product-list-filter-ui-display-when'
import { SimpleAttributeValue } from './simple-attribute-value'
import { TaxonomyTerm } from './taxonomy-term'

export interface ProductListFilterUi {
    filterType: ProductListFilterType
    enabled: boolean
    displayAlways?: boolean
    displayWhen?: ProductListFilterUiDisplayWhen
    label?: string
    taxonomyTermOptions?: TaxonomyTerm[]
    attributeValueOptions?: (AttributeValue | SimpleAttributeValue)[]
}
