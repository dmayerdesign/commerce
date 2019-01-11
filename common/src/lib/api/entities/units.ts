import { Column } from 'typeorm'
import { LengthUnit } from '../../constants/enums/length-unit'
import { WeightUnit } from '../../constants/enums/weight-unit'
import { Units as IUnits } from '../interfaces/units'

export class Units implements IUnits {
    @Column({ enum: WeightUnit }) public weight: WeightUnit
    @Column({ enum: LengthUnit }) public length: LengthUnit
}
