import { Entity } from '../data-access/entity.interface'
import { Price } from '../price/price.interface'
import { Product } from '../product/product.interface'
import { TaxonomyTerm } from '../taxonomy-term/taxonomy-term.interface'

export interface DiscountExceptions {
    products: Product[]
    taxonomyTerms: TaxonomyTerm[]
}

export interface Discount extends Entity {
    code: string
    total: Price
    percentage: number // `20` for a 20% discount
    freeShipping: boolean
    includes?: DiscountExceptions
    excludes?: DiscountExceptions
}
