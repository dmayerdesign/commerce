import { WeightUnit } from '@qb/common/constants/enums/weight-unit'
import { Column } from 'typeorm'
import { Weight as IWeight } from '../interfaces/weight'

export class Weight implements IWeight {
    @Column() public amount: number
    @Column({ type: String, enum: WeightUnit }) public unitOfMeasurement: WeightUnit
}
