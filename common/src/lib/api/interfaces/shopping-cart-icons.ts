import { MongooseDocument } from './mongoose-document'

export interface ShoppingCartIcons extends MongooseDocument {
    empty: string
    1: string
    2: string
    3: string
    full: string
}
