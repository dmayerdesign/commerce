import { ObjectId } from 'mongodb'
import { Entity, JoinColumn, ManyToMany, ManyToOne, ObjectIdColumn } from 'typeorm'
import { Product } from '../product/product'
import { User } from '../user/user'
import { Wishlist as IWishlist } from './wishlist.interface'

@Entity()
export class Wishlist implements IWishlist {
    @ObjectIdColumn() public id: ObjectId

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    public user: User

    @ManyToMany(() => Product, x => x.id)
    @JoinColumn()
    public products: Product[]
}
