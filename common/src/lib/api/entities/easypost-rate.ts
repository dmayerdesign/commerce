import { Column } from 'typeorm'
import { Currency } from '../../constants/enums/currency'
import { EasypostRate as IEasypostRate } from '../interfaces/easypost-rate'

export class EasypostRate implements IEasypostRate {
    @Column() public readonly created_at: string
    @Column() public readonly updated_at: string
    @Column({ enum: ['test', 'production'] }) public readonly mode: string /* "test" or "production" */
    @Column() public readonly service: string /* service level/name */
    @Column() public readonly carrier: string /* name of carrier */
    @Column() public readonly carrier_account_id: string /* ID of the CarrierAccount record used to generate this rate */
    @Column() public readonly shipment_id: string /* ID of the Shipment this rate belongs to */
    @Column() public readonly rate: string /* the actual rate quote for this service */
    @Column() public readonly currency: string /* currency for the rate */
    @Column() public readonly retail_rate: string /* the retail rate is the in-store rate given with no account */
    @Column() public readonly retail_currency: string /* currency for the retail rate */
    @Column() public readonly list_rate: string /* the list rate is the non-negotiated rate given for having an account with the carrier */
    @Column({ enum: Currency }) public readonly list_currency: Currency /* currency for the list rate */
    @Column() public readonly delivery_days: number /* delivery days for this service */
    @Column() public readonly delivery_date: string /* date for delivery */
    @Column() public readonly delivery_date_guaranteed: boolean /* indicates if delivery window is guaranteed (true) or not (false) */
    @Column() public readonly est_delivery_days?: number /* This field is deprecated and should be ignored. */
}
