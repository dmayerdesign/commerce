import { Column, Entity, ObjectIdColumn, ObjectID, OneToMany } from 'typeorm'
import { Cart as ICart } from '../interfaces/cart'
import { Discount } from './discount'
import { Price } from './price'
import { Product } from './product'

@Entity()
export class Cart implements ICart {
  @ObjectIdColumn() public id: ObjectID
  @Column() public count?: number
  @OneToMany(() => Product, product => product.id) public products: Product[]
  @Column() public subTotal: Price
  @Column() public total: Price
  @OneToMany(() => Discount, discount => discount.id) public discounts?: Discount[]
}
