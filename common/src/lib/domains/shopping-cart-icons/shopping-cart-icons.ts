import { Column } from 'typeorm'
import { ShoppingCartIcons as IShoppingCartIcons } from './shopping-cart-icons.interface'

export class ShoppingCartIcons implements IShoppingCartIcons {
    @Column() public empty: string
    @Column() public 1: string
    @Column() public 2: string
    @Column() public 3: string
    @Column() public full: string
}
