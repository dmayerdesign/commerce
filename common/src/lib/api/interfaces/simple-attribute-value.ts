import { Attribute } from './attribute'
import { Entity } from './entity'

export interface SimpleAttributeValue extends Entity {
    attribute: Attribute
    value: any
}
