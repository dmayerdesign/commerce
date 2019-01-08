import { Attribute } from './attribute'
import { Entity } from './entity'

export interface AttributeValue extends Entity {
    attribute: Attribute
    name: string
    slug: string
    description: string
    value: any
}
