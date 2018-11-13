import { Document } from 'mongoose'

export interface Attribute extends Document {
    singularName: string
    pluralName: string
    slug: string
    description: string
}
