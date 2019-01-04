import { Document } from '@qb/common/goosetype/interfaces'
import { CartDisplayItem } from '../../models/ui/cart-display-item'
import { Order } from './order'
import { Organization } from './organization'
import { Product } from './product'

export interface EmailStyleOptions extends Document {
    mastheadBgColor: string
    accentColor: string
    fontFamily: string
    innerBgColor: string
}

export interface EmailOptions extends Document {
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

export interface OrderEmailOptions extends EmailOptions {
    order?: Order
    orderDisplayProducts: CartDisplayItem<Product>[]
}
