import { Column, Entity, JoinColumn, ObjectIdColumn, ObjectID, OneToMany } from 'typeorm'
import { Discount } from '../discount/discount'
import { Price } from '../price/price'
import { Product } from '../product/product'
import { Cart as ICart } from './cart'

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
