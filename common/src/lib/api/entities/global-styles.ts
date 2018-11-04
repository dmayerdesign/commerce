import { prop, schema, MongooseDocument } from '../../goosetype'
import { ShoppingCartIcons } from './shopping-cart-icons'

@schema(GlobalStyles)
export class GlobalStyles extends MongooseDocument {
    @prop() public backgroundPatternImageSrc: string
    @prop() public shoppingCartIcons: ShoppingCartIcons
}
