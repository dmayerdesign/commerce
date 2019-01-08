import { CartItem } from './cart-item'
import { Discount } from './discount'
import { Price } from './price'

export interface Cart {
    count?: number
    products: CartItem[]
    subTotal: Price
    total: Price
    discounts?: Discount[]
}
