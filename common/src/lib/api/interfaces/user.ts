import { UserRole } from '../../constants/enums/user-role'
import { Address } from './address'
import { Cart } from './cart'
import { Image } from './image'
import { MongooseDocument } from './mongoose-document'
import { Order } from './order'
import { Ref } from './ref'
import { Wishlist } from './wishlist'

export interface User extends MongooseDocument {
    email: string
    emailIsVerified?: boolean
    emailVerificationToken?: string
    emailTokenExpires?: number
    password?: string
    passwordResetToken?: string
    passwordResetExpires?: string
    role?: UserRole

    name?: string
    lastName?: string
    firstName?: string
    gender?: string
    avatar?: Image
    address?: Address
    phoneNumber?: string

    facebookId?: string
    googleId?: string

    orders?: Ref<Order>[]
    stripeCustomerId?: string

    cart?: Cart
    wishlist?: Ref<Wishlist>
}
