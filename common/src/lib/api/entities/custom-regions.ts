import { arrayProp, schema, MongooseDocument } from '../../goosetype'
import { CustomRegion } from './custom-region'

@schema()
export class CustomRegions extends MongooseDocument {
    @arrayProp({ itemsType: CustomRegion }) public productDetailInfoHeader: CustomRegion[]
    @arrayProp({ itemsType: CustomRegion }) public productDetailMid: CustomRegion[]
}
