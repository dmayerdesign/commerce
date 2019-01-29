import { UserRole } from '../../constants/enums/user-role'
import { Address } from '../address/address.interface'
import { Cart } from '../cart/cart.interface'
import { Entity } from '../data-access/entity.interface'
import { Image } from '../image/image.interface'
import { Order } from '../order/order.interface'
import { Wishlist } from '../wishlist/wishlist.interface'

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
