import { MongooseDocument } from './mongoose-document'

export interface Dimensions extends MongooseDocument {
    length: number
    width: number
    height: number
}
