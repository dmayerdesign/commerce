import { Document } from '@qb/common/goosetype/interfaces'

export interface Attribute extends Document {
    singularName: string
    pluralName: string
    slug: string
    description: string
}
