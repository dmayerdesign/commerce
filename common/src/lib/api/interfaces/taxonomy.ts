import { MongooseDocument } from './mongoose-document'

export interface Taxonomy extends MongooseDocument {
    singularName: string
    pluralName: string
    slug: string
    description: string
}
