import { arrayProp, model, prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { Price } from './price'
import { Product } from './product'
import { TaxonomyTerm } from './taxonomy-term'

@schema()
export class DiscountExceptions extends MongooseDocument {
    @arrayProp({ itemsRef: Product }) public products: Ref<Product>[]
    @arrayProp({ itemsRef: TaxonomyTerm }) public taxonomyTerms: Ref<TaxonomyTerm>[]
}

@model(Discount)
export class Discount extends MongooseDocument {
    @prop() public code: string
    @prop() public total: Price
    @prop() public percentage: number // `20` for a 20% discount
    @prop() public freeShipping: boolean
    @prop() public includes: DiscountExceptions
    @prop() public excludes: DiscountExceptions
}

export class CreateDiscountError extends Error { }
export class FindDiscountError extends Error { }
export class UpdateDiscountError extends Error { }
export class DeleteDiscountError extends Error { }
