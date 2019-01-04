import { UserRole } from '../../constants/enums/user-role'
import { arrayProp, model, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { Address } from './address'
import { Cart } from './cart'
import { Image } from './image'
import { Order } from './order'
import { Wishlist } from './wishlist'

@model(MongooseSchemaOptions.timestamped)
export class User {
    @ObjectIdColumn() public id: ObjectID
    @Column({ required: true }) public email: string
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
    @Column() public avatar?: Image
    @Column() public address?: Address
    @Column() public phoneNumber?: string

    @Column() public facebookId?: string
    @Column() public googleId?: string

    @OneToMany({ ref: Order }) public orders?: Ref<Order>[]
    @Column() public stripeCustomerId?: string

    @Column() public cart?: Cart
    @Column({ ref: Wishlist }) public wishlist?: Ref<Wishlist>
}
