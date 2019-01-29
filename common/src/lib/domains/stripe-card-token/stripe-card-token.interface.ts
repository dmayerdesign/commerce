import { StripeCardHash } from '../stripe-card-hash/stripe-card-hash.interface'

export interface StripeCardToken {
    object: string
    id: string
    client_ip: string
    created: number
    livemode: boolean
    type: string /* "card" | "bank_account" */
    used: boolean
    card?: StripeCardHash
}
