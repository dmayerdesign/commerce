import { arrayProp, prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { CartItem } from '../interfaces/cart-item'
import { Discount } from './discount'
import { Price } from './price'

@schema()
export class Cart extends MongooseDocument {
    @prop() public count?: number
    @arrayProp({ refPath: 'cartrefModelName' }) public items: Ref<CartItem>[]
    @prop() public subTotal: Price
    @prop() public total: Price
    @arrayProp({ ref: Discount }) public discounts?: Ref<Discount>[]
}
