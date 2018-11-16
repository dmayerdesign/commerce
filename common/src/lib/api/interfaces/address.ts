import { Document } from '@qb/common/goosetype/interfaces'

export interface Address extends Document {
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
