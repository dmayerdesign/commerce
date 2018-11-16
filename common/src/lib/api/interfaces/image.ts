import { Document } from '@qb/common/goosetype/interfaces'

export interface Image extends Document {
    large?: string
    medium?: string
    thumbnail?: string
}
