import { ProductListFilterType } from '../domains/product/product-list-filter'

export interface ProductListFilterUiConfig {
  [key: string]: {
    slug: string
    productListFilterType: ProductListFilterType
    isRange?: boolean
  }
}

export const productListFilterUiConfig: ProductListFilterUiConfig = {
  priceRange: {
    slug: 'price-range',
    productListFilterType: ProductListFilterType.Property,
    isRange: true,
  },
  productTypes: {
    slug: 'product-types',
    productListFilterType: ProductListFilterType.TaxonomyTerm,
  },
  brands: {
    slug: 'brands',
    productListFilterType: ProductListFilterType.TaxonomyTerm,
  },
  colors: {
    slug: 'colors',
    productListFilterType: ProductListFilterType.AttributeValue,
  },
  // Custom.
  taxonomyTermChecklist: {
    slug: 'taxonomy-term-checklist',
    productListFilterType: ProductListFilterType.TaxonomyTerm,
  },
  attributeValueChecklist: {
    slug: 'attribute-value-checklist',
    productListFilterType: ProductListFilterType.AttributeValue,
  },
  simpleAttributeValueChecklist: {
    slug: 'simple-attribute-value-checklist',
    productListFilterType: ProductListFilterType.SimpleAttributeValue,
  },
}
