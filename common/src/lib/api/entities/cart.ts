import { Column, Entity, ObjectIdColumn, ObjectID, OneToMany } from 'typeorm'
import { Discount } from './discount'
import { Price } from './price'
import { Product } from './product'

@Entity()
export class Cart {
  @ObjectIdColumn() public id: ObjectID
  @Column() public count?: number
  @OneToMany(() => Product, product => product.id) public products: Product[]
  @Column() public subTotal: Price
  @Column() public total: Price
  @OneToMany(() => Discount, discount => discount.id) public discounts?: Discount[]
}
