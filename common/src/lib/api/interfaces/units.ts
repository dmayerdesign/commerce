import { LengthUnit } from '../../constants/enums/length-unit'
import { WeightUnit } from '../../constants/enums/weight-unit'
import { Document } from './document'

export interface Units extends Document {
    weight: WeightUnit
    length: LengthUnit
}
