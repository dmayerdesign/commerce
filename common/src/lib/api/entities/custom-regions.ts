import { arrayProp, schema, MongooseDocument } from '../../goosetype'
import { CustomRegion } from './custom-region'

@schema()
export class CustomRegions extends MongooseDocument {
    @arrayProp({ type: CustomRegion }) public productDetailInfoHeader: CustomRegion[]
    @arrayProp({ type: CustomRegion }) public productDetailMid: CustomRegion[]
}
