import { MongooseDocument } from './mongoose-document'

export interface StripeCardHash extends MongooseDocument {
    id: string
    object: string
    number: number
    brand: string
    exp_month: number
    exp_year: number
    funding: string
    last4: string
    address_city: string
    address_country: string
    address_line1: string
    address_line1_check: string
    address_line2: string
    address_state: string
    address_zip: string
    address_zip_check: string
    country: string
    cvc_check: string
    dynamic_last4: string
    name: string
    fingerprint: string
    tokenization_method: string
}
