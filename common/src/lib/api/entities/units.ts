import { LengthUnit } from '../../constants/enums/length-unit'
import { WeightUnit } from '../../constants/enums/weight-unit'
import { prop, schema, MongooseDocument } from '../../goosetype'

@schema()
export class Units {
    @Column({ enum: WeightUnit }) public weight: WeightUnit
    @Column({ enum: LengthUnit }) public length: LengthUnit
}
