import { Entity } from './entity'

export interface Attribute extends Entity {
    singularName: string
    pluralName: string
    slug: string
    description: string
}
