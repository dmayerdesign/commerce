import { Document } from '@qb/common/goosetype/interfaces'

export interface Dimensions extends Document {
    length: number
    width: number
    height: number
}
