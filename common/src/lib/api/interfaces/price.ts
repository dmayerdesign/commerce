import { Currency } from '../../constants/enums/currency'
import { MongooseDocument } from './mongoose-document'

export interface Price extends MongooseDocument {
    amount: number
    currency: Currency
}
