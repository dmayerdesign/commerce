import { Document } from './document'
import { Product } from './product'
import { Ref } from './ref'

export interface Wishlist extends Document {
    userId: string
    products: Ref<Product>[]
}
