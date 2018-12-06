import { WeightUnit } from '../../constants/enums/weight-unit'
import { Document } from './document'

export interface Weight extends Document {
    amount: number
    unitOfMeasurement: WeightUnit
}
