import { Document } from '@qb/common/goosetype/interfaces'
import { Attribute } from './attribute'
import { Ref } from './ref'

export interface AttributeValue extends Document {
    attribute: Ref<Attribute>
    name: string
    slug: string
    description: string
    value: any
}
