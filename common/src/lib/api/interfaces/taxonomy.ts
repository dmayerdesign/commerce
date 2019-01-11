import { Entity } from './entity'

export interface Taxonomy extends Entity {
    slug: string
    singularName?: string
    pluralName?: string
    description?: string
}
