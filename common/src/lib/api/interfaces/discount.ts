import { MongooseDocument } from './mongoose-document'
import { Price } from './price'
import { Product } from './product'
import { Ref } from './ref'
import { TaxonomyTerm } from './taxonomy-term'

export interface DiscountExceptions extends MongooseDocument {
    products: Ref<Product>[]
    taxonomyTerms: Ref<TaxonomyTerm>[]
}

export interface Discount extends MongooseDocument {
    code: string
    total: Price
    percentage: number // `20` for a 20% discount
    freeShipping: boolean
    includes: DiscountExceptions
    excludes: DiscountExceptions
}
