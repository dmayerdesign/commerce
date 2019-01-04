import { Currency } from '../../constants/enums/currency'
import { prop, schema, MongooseDocument } from '../../goosetype'

@schema({ _id: false })
export class Price {
    @Column() public amount: number
    @Column({ enum: Currency, type: String }) public currency: Currency
}
