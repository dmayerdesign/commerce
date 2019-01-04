import { Column, Entity, ObjectIdColumn, ObjectID, OneToMany } from 'typeorm'
import { Price } from './price'
import { Product } from './product'
import { TaxonomyTerm } from './taxonomy-term'

export class DiscountExceptions {
  @OneToMany(() => Product, product => product.id) public products: Product[]
  @OneToMany(() => TaxonomyTerm, taxonomyTerm => taxonomyTerm.id) public taxonomyTerms: TaxonomyTerm[]
}

@Entity()
export class Discount {
  @ObjectIdColumn() public id: ObjectID
  @Column() public code: string
  @Column() public total: Price
  @Column() public percentage: number // `20` for a 20% discount
  @Column() public freeShipping: boolean
  @Column() public includes: DiscountExceptions
  @Column() public excludes: DiscountExceptions
}
