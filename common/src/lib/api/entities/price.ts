import { Column } from 'typeorm'
import { Currency } from '../../constants/enums/currency'

export class Price {
    @Column() public amount: number
    @Column({ enum: Currency, type: String }) public currency: Currency
}
