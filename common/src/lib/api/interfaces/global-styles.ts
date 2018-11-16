import { Document } from '@qb/common/goosetype/interfaces'
import { ShoppingCartIcons } from './shopping-cart-icons'

export interface GlobalStyles extends Document {
    backgroundPatternImageSrc: string
    shoppingCartIcons: ShoppingCartIcons
}
