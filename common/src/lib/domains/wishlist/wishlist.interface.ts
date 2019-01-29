import { Product } from '../product/product.interface'
import { User } from '../user/user.interface'

export interface Wishlist {
    user: User
    products: Product[]
}
