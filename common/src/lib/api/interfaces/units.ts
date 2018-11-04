import { LengthUnit } from '../../constants/enums/length-unit'
import { WeightUnit } from '../../constants/enums/weight-unit'
import { MongooseDocument } from './mongoose-document'

export interface Units extends MongooseDocument {
    weight: WeightUnit
    length: LengthUnit
}
