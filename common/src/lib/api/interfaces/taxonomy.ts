import { Entity } from './entity'

export interface Taxonomy extends Entity {
    singularName: string
    pluralName: string
    slug: string
    description: string
}
