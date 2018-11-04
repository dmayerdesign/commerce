import { CustomRegion } from './custom-region'
import { MongooseDocument } from './mongoose-document'

export interface CustomRegions extends MongooseDocument {
    productDetailInfoHeader: CustomRegion[]
    productDetailMid: CustomRegion[]
}
