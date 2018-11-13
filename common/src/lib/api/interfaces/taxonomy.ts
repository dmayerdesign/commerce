import { Document } from 'mongoose'

export interface Taxonomy extends Document {
    singularName: string
    pluralName: string
    slug: string
    description: string
}
