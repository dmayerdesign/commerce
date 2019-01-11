import { Attribute } from './attribute'
import { Entity } from './entity'

export interface AttributeValue extends Entity {
    slug: string
    value: any
    attribute: Attribute
    name?: string
    description?: string
}
