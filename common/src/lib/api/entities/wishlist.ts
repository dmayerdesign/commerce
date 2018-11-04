import { arrayProp, model, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { Product } from './product'

@model(Wishlist, MongooseSchemaOptions.timestamped)
export class Wishlist extends MongooseDocument {
    @prop() public userId: string
    @arrayProp({ itemsRef: Product }) public products: Ref<Product>[]
}

// Errors.

export class CreateWishlistError extends Error { }
export class FindWishlistError extends Error { }
export class UpdateWishlistError extends Error { }
export class DeleteWishlistError extends Error { }
