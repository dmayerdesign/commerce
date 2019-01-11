import { Column, Entity, JoinColumn, ManyToMany, ObjectIdColumn, ObjectID } from 'typeorm'
import { Wishlist as IWishlist } from '../interfaces/wishlist'
import { Product } from './product'

@Entity()
export class Wishlist implements IWishlist {
    @ObjectIdColumn() public id: ObjectID
    @Column() public userId: string

    @ManyToMany(() => Product, x => x.id)
    @JoinColumn()
    public products: Product[]
}
