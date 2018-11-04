import { arrayProp, prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { CartItem } from '../interfaces/cart-item'
import { Discount } from './discount'
import { Price } from './price'

@schema(Cart)
export class Cart extends MongooseDocument {
    @prop() public count?: number
    @arrayProp({ itemsRefPath: 'cartItemsRefModelName' }) public items: Ref<CartItem>[]
    @prop() public subTotal: Price
    @prop() public total: Price
    @arrayProp({ itemsRef: Discount }) public discounts?: Ref<Discount>[]
}
