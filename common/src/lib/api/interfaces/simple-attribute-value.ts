import { Attribute } from './attribute'
import { Document } from './document'
import { Ref } from './ref'

export interface SimpleAttributeValue extends Document {
    attribute: Ref<Attribute>
    value: any
}
