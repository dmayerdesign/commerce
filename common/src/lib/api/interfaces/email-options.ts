import { CartDisplayItem } from '../../models/ui/cart-display-item'
import { Order } from './order'
import { Organization } from './organization'
import { Product } from './product'

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
    organization?: Organization
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
    organization?: Organization
}

export interface OrderEmailOptions extends EmailServiceOptions {
    order?: Order
    orderDisplayItems: CartDisplayItem<Product>[]
}
