import { LengthUnit } from '../../constants/enums/length-unit'
import { WeightUnit } from '../../constants/enums/weight-unit'
import { prop, schema, MongooseDocument } from '../../goosetype'

@schema(Units)
export class Units extends MongooseDocument {
    @prop({ enum: WeightUnit }) public weight: WeightUnit
    @prop({ enum: LengthUnit }) public length: LengthUnit
}
