import { Attribute } from './attribute'
import { MongooseDocument } from './mongoose-document'
import { Ref } from './ref'

export interface AttributeValue extends MongooseDocument {
    attribute: Ref<Attribute>
    name: string
    slug: string
    description: string
    value: any
}
