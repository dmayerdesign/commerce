import { CartItem } from './cart-item'
import { Discount } from './discount'
import { MongooseDocument } from './mongoose-document'
import { Price } from './price'
import { Ref } from './ref'

export interface Cart extends MongooseDocument {
    count?: number
    items: Ref<CartItem>[]
    subTotal: Price
    total: Price
    discounts?: Ref<Discount>[]
}
