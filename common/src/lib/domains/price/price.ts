import { Column } from 'typeorm'
import { Currency } from '../../constants/enums/currency'
import { Price as IPrice } from './price.interface'

export class Price implements IPrice {
    @Column() public amount: number
    @Column({ enum: Currency }) public currency: Currency
}
