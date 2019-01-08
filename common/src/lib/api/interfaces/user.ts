import { UserRole } from '../../constants/enums/user-role'
import { Address } from './address'
import { Cart } from './cart'
import { Entity } from './entity'
import { Image } from './image'
import { Order } from './order'
import { Wishlist } from './wishlist'

export interface User extends Entity {
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

    orders?: Order[]
    stripeCustomerId?: string

    cart?: Cart
    wishlist?: Wishlist
}
