import { MongooseDocument } from './mongoose-document'

export interface Image extends MongooseDocument {
    large?: string
    medium?: string
    thumbnail?: string
}
