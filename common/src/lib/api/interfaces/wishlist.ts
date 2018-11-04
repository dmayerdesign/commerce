import { MongooseDocument } from './mongoose-document'
import { Product } from './product'
import { Ref } from './ref'

export interface Wishlist extends MongooseDocument {
    userId: string
    products: Ref<Product>[]
}
