import { Discount } from '../discount/discount.interface'
import { Price } from '../price/price.interface'
import { CartItem } from './cart-item'

export interface Cart {
    count?: number
    products: CartItem[]
    subTotal: Price
    total: Price
    discounts?: Discount[]
}
