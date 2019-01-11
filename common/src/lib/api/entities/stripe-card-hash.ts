import { Column } from 'typeorm'

export class StripeCardHash {
    @Column() public id: string
    @Column() public object: string
    @Column() public number: number
    @Column() public brand: string
    @Column() public exp_month: number
    @Column() public exp_year: number
    @Column() public funding: string
    @Column() public last4: string
    @Column() public address_city: string
    @Column() public address_country: string
    @Column() public address_line1: string
    @Column() public address_line1_check: string
    @Column() public address_line2: string
    @Column() public address_state: string
    @Column() public address_zip: string
    @Column() public address_zip_check: string
    @Column() public country: string
    @Column() public cvc_check: string
    @Column() public dynamic_last4: string
    @Column() public name: string
    @Column() public fingerprint: string
    @Column() public tokenization_method: string
}
