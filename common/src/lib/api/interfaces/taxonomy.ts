import { Document } from '@qb/common/goosetype/interfaces'

export interface Taxonomy extends Document {
    singularName: string
    pluralName: string
    slug: string
    description: string
}
