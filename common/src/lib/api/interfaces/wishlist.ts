import { Product } from './product'
import { User } from './user'

export interface Wishlist {
    user: User
    products: Product[]
}
