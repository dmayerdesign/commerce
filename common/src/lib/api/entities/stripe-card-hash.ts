import { prop, schema, MongooseDocument } from '../../goosetype'

@schema()
export class StripeCardHash extends MongooseDocument {
    @prop() public id: string
    @prop() public object: string
    @prop() public number: number
    @prop() public brand: string
    @prop() public exp_month: number
    @prop() public exp_year: number
    @prop() public funding: string
    @prop() public last4: string
    @prop() public address_city: string
    @prop() public address_country: string
    @prop() public address_line1: string
    @prop() public address_line1_check: string
    @prop() public address_line2: string
    @prop() public address_state: string
    @prop() public address_zip: string
    @prop() public address_zip_check: string
    @prop() public country: string
    @prop() public cvc_check: string
    @prop() public dynamic_last4: string
    @prop() public name: string
    @prop() public fingerprint: string
    @prop() public tokenization_method: string
}
