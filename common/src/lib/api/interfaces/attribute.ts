import { MongooseDocument } from './mongoose-document'

export interface Attribute extends MongooseDocument {
    singularName: string
    pluralName: string
    slug: string
    description: string
}
