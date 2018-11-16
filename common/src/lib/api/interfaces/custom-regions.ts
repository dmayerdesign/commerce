import { Document } from '@qb/common/goosetype/interfaces'
import { CustomRegion } from './custom-region'

export interface CustomRegions extends Document {
    productDetailInfoHeader: CustomRegion[]
    productDetailMid: CustomRegion[]
}
