import { MongooseDocument } from './mongoose-document'
import { ShoppingCartIcons } from './shopping-cart-icons'

export interface GlobalStyles extends MongooseDocument {
    backgroundPatternImageSrc: string
    shoppingCartIcons: ShoppingCartIcons
}
