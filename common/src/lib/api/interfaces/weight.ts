import { WeightUnit } from '../../constants/enums/weight-unit'
import { MongooseDocument } from './mongoose-document'

export interface Weight extends MongooseDocument {
    amount: number
    unitOfMeasurement: WeightUnit
}
