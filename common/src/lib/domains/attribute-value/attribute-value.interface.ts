import { Attribute } from '../attribute/attribute.interface'
import { Entity } from '../data-access/entity.interface'

export interface AttributeValue extends Entity {
    slug: string
    value: any
    attribute: Attribute
    name?: string
    description?: string
}
