import { Document } from '@qb/common/goosetype/interfaces'
import { CartItem } from './cart-item'
import { Discount } from './discount'
import { Price } from './price'
import { Ref } from './ref'

export interface Cart extends Document {
    count?: number
    items: Ref<CartItem>[]
    subTotal: Price
    total: Price
    discounts?: Ref<Discount>[]
}
