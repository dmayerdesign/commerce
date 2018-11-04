import { MongooseDocument } from './mongoose-document'

export interface EasypostRate extends MongooseDocument {
    created_at: string
    updated_at: string
    mode: string /* "test" or "production" */
    service: string /* service level/name */
    carrier: string /* name of carrier */
    carrier_account_id: string /* ID of the CarrierAccount record used to generate this rate */
    shipment_id: string /* ID of the Shipment this rate belongs to */
    rate: string /* the actual rate quote for this service */
    currency: string /* currency for the rate */
    retail_rate: string /* the retail rate is the in-store rate given with no account */
    retail_currency: string /* currency for the retail rate */
    list_rate: string /* the list rate is the non-negotiated rate given for having an account with the carrier */
    list_currency: string /* currency for the list rate */
    delivery_days: number /* delivery days for this service */
    delivery_date: string /* date for delivery */
    delivery_date_guaranteed: boolean /* indicates if delivery window is guaranteed (true) or not (false) */
    est_delivery_days?: number /* This field is deprecated and should be ignored. */
}
