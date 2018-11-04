import { MongooseDocument } from './mongoose-document'

export interface Revision extends MongooseDocument {
    id: string
    field: string
    value: any
}
