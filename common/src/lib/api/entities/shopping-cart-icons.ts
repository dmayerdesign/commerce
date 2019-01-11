import { Column } from 'typeorm'

export class ShoppingCartIcons {
    @Column() public empty: string
    @Column() public 1: string
    @Column() public 2: string
    @Column() public 3: string
    @Column() public full: string
}
