import { Entity, JoinColumn, ManyToMany, ManyToOne, ObjectIdColumn, ObjectID } from 'typeorm'
import { Wishlist as IWishlist } from '../interfaces/wishlist'
import { Product } from './product'
import { User } from './user'

@Entity()
export class Wishlist implements IWishlist {
    @ObjectIdColumn() public id: ObjectID

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    public user: User

    @ManyToMany(() => Product, x => x.id)
    @JoinColumn()
    public products: Product[]
}
