export enum ProductListFilterType {
  Property = 'property',
  AttributeValue = 'attribute-value',
  SimpleAttributeValue = 'simple-attribute-value',
  TaxonomyTerm = 'taxonomy-term',
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
