import { Currency } from '../../constants/enums/currency'
import { prop, schema, MongooseDocument } from '../../goosetype'

@schema(EasypostRate)
export class EasypostRate extends MongooseDocument {
    @prop() public readonly created_at: string
    @prop() public readonly updated_at: string
    @prop({ enum: ['test', 'production'] }) public readonly mode: string /* "test" or "production" */
    @prop() public readonly service: string /* service level/name */
    @prop() public readonly carrier: string /* name of carrier */
    @prop() public readonly carrier_account_id: string /* ID of the CarrierAccount record used to generate this rate */
    @prop() public readonly shipment_id: string /* ID of the Shipment this rate belongs to */
    @prop() public readonly rate: string /* the actual rate quote for this service */
    @prop() public readonly currency: string /* currency for the rate */
    @prop() public readonly retail_rate: string /* the retail rate is the in-store rate given with no account */
    @prop() public readonly retail_currency: string /* currency for the retail rate */
    @prop() public readonly list_rate: string /* the list rate is the non-negotiated rate given for having an account with the carrier */
    @prop({ enum: Currency }) public readonly list_currency: string /* currency for the list rate */
    @prop() public readonly delivery_days: number /* delivery days for this service */
    @prop() public readonly delivery_date: string /* date for delivery */
    @prop() public readonly delivery_date_guaranteed: boolean /* indicates if delivery window is guaranteed (true) or not (false) */
    @prop() public readonly est_delivery_days?: number /* This field is deprecated and should be ignored. */
}
