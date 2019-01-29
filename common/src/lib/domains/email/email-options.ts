import { CartDisplayProduct } from '../../models/ui/cart-display-product'
import { Order } from '../order/order.interface'
import { Organization } from '../organization/organization.interface'

export interface EmailStyleOptions {
    mastheadBgColor: string
    accentColor: string
    fontFamily: string
    innerBgColor: string
}

export interface EmailServiceOptions {
    fromName?: string
    fromEmail?: string
    toName?: string
    toEmail: string
    subject?: string
    preheader?: string
    html?: string
    text?: string
    organization: Organization
}

export interface EmailOptions {
    fromName: string
    fromEmail: string
    toName?: string
    toEmail: string
    subject: string
    preheader?: string
    html?: string
    text?: string
    organization: Organization
}

export interface OrderEmailOptions extends EmailServiceOptions {
    order: Order
    orderDisplayProducts: CartDisplayProduct[]
}
