import { WeightUnit } from '../../constants/enums/weight-unit'
import { prop, schema, MongooseDocument } from '../../goosetype'

@schema({ _id: false })
export class Weight {
    @Column() public amount: number
    @Column({ enum: WeightUnit, type: String }) public unitOfMeasurement: WeightUnit
}
