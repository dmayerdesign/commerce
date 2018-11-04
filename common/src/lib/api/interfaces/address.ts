import { MongooseDocument } from './mongoose-document'

export interface Address extends MongooseDocument {
    name?: string
    company?: string
    street1: string
    street2?: string
    city: string
    state: string
    country: string
    zip: string
    phone?: string
}
