import { UserRole } from '../../constants/enums/user-role'
import { arrayProp, model, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { Address } from './address'
import { Cart } from './cart'
import { Image } from './image'
import { Order } from './order'
import { Wishlist } from './wishlist'

@model(User, MongooseSchemaOptions.timestamped)
export class User extends MongooseDocument {
    @prop({ required: true }) public email: string
    @prop() public emailIsVerified?: boolean
    @prop() public emailVerificationToken?: string
    @prop() public emailTokenExpires?: number
    @prop() public password?: string
    @prop() public passwordResetToken?: string
    @prop() public passwordResetExpires?: string
    @prop({ type: Number, enum: UserRole }) public role?: UserRole

    @prop() public name?: string
    @prop() public lastName?: string
    @prop() public firstName?: string
    @prop() public gender?: string
    @prop() public avatar?: Image
    @prop() public address?: Address
    @prop() public phoneNumber?: string

    @prop() public facebookId?: string
    @prop() public googleId?: string

    @arrayProp({ itemsRef: Order }) public orders?: Ref<Order>[]
    @prop() public stripeCustomerId?: string

    @prop() public cart?: Cart
    @prop({ ref: Wishlist }) public wishlist?: Ref<Wishlist>
}

// Errors.

export class CreateUserError extends Error { }
export class FindUserError extends Error { }
export class UpdateUserError extends Error { }
export class DeleteUserError extends Error { }
