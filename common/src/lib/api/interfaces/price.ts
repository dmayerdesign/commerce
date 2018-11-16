import { Document } from '@qb/common/goosetype/interfaces'
import { Currency } from '../../constants/enums/currency'

export interface Price extends Document {
    amount: number
    currency: Currency
}
