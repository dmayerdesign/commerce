import { Column } from 'typeorm'
import { ShoppingCartIcons } from './shopping-cart-icons'

export class GlobalStyles {
    @Column() public backgroundPatternImageSrc: string
    @Column() public shoppingCartIcons: ShoppingCartIcons
}
