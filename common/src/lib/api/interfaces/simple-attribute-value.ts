import { Attribute } from './attribute'
import { MongooseDocument } from './mongoose-document'
import { Ref } from './ref'

export interface SimpleAttributeValue extends MongooseDocument {
    attribute: Ref<Attribute>
    value: any
}
