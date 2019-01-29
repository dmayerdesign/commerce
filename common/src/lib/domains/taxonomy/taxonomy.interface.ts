import { Entity } from '../data-access/entity.interface'

export interface Taxonomy extends Entity {
    slug: string
    singularName?: string
    pluralName?: string
    description?: string
}
