import { Document } from './document'
import { StripeCardHash } from './stripe-card-hash'

export interface StripeCardToken extends Document {
    object: string
    id: string
    client_ip: string
    created: number
    livemode: boolean
    type: string /* "card" | "bank_account" */
    used: boolean
    card?: StripeCardHash
}
