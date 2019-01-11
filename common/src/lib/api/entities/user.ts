import { Column, CreateDateColumn, Entity, JoinColumn, ObjectIdColumn, ObjectID, OneToMany, UpdateDateColumn } from 'typeorm'
import { UserRole } from '../../constants/enums/user-role'
import { User as IUser } from '../interfaces/user'
import { Address } from './address'
import { Cart } from './cart'
import { Image } from './image'
import { Order } from './order'
import { Wishlist } from './wishlist'

@Entity()
export class User implements IUser {
    @ObjectIdColumn() public id: ObjectID
    @Column() public email: string
    @Column() public emailIsVerified?: boolean
    @Column() public emailVerificationToken?: string
    @Column() public emailTokenExpires?: number
    @Column() public password?: string
    @Column() public passwordResetToken?: string
    @Column() public passwordResetExpires?: string
    @Column({ type: Number, enum: UserRole }) public role?: UserRole

    @Column() public name?: string
    @Column() public lastName?: string
    @Column() public firstName?: string
    @Column() public gender?: string
    @Column(() => Image) public avatar?: Image
    @Column(() => Address) public address?: Address
    @Column() public phoneNumber?: string

    @Column() public facebookId?: string
    @Column() public googleId?: string

    @OneToMany(() => Order, x => x.id)
    @JoinColumn()
    public orders?: Order[]

    @Column() public stripeCustomerId?: string

    @Column(() => Cart) public cart?: Cart
    @Column(() => Wishlist) public wishlist?: Wishlist

    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
