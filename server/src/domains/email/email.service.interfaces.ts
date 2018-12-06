import { Order } from '@qb/common/api/interfaces/order'
import { Organization } from '@qb/common/api/interfaces/organization'
import { Product } from '@qb/common/api/interfaces/product'
import { CartDisplayItem } from '@qb/common/models/ui/cart-display-item'

export interface EmailService {
  sendEmail(options: EmailOptions): Promise<any>
  sendReceipt(options: OrderEmailOptions): Promise<any>
  sendShippingNotification(options: OrderEmailOptions): Promise<any>
  sendEmailVerification(options: EmailServiceOptions): Promise<any>
  reportError(error: Error): Promise<any>
}

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
