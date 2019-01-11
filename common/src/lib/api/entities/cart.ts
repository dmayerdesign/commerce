import { Column, Entity, JoinColumn, ObjectIdColumn, ObjectID, OneToMany } from 'typeorm'
import { Cart as ICart } from '../interfaces/cart'
import { Discount } from './discount'
import { Price } from './price'
import { Product } from './product'

@Entity()
export class Cart implements ICart {
  @ObjectIdColumn() public id: ObjectID

  @OneToMany(() => Product, product => product.id)
  @JoinColumn()
  public products: Product[]

  @Column(() => Price) public subTotal: Price
  @Column(() => Price) public total: Price

  @OneToMany(() => Discount, discount => discount.id, )
  @JoinColumn()
  public discounts?: Discount[]

  @Column() public count?: number
}
