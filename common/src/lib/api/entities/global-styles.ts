import { Column } from 'typeorm'
import { GlobalStyles as IGlobalStyles } from '../interfaces/global-styles'
import { ShoppingCartIcons } from './shopping-cart-icons'

export class GlobalStyles implements IGlobalStyles {
    @Column() public backgroundPatternImageSrc: string
    @Column() public shoppingCartIcons: ShoppingCartIcons
}
