import { Column } from 'typeorm'
import { GlobalStyles as IGlobalStyles } from '../global-styles/global-styles.interface'
import { ShoppingCartIcons } from '../shopping-cart-icons/shopping-cart-icons'

export class GlobalStyles implements IGlobalStyles {
    @Column() public backgroundPatternImageSrc: string
    @Column(() => ShoppingCartIcons) public shoppingCartIcons: ShoppingCartIcons
}
