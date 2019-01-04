import { prop, schema, MongooseDocument } from '../../goosetype'

import { StripeCardHash } from './stripe-card-hash'

@schema()
export class StripeCardToken {
    @Column() public object: string
    @Column() public id: string
    @Column() public client_ip: string
    @Column() public created: number
    @Column() public livemode: boolean
    @Column() public type: string /* "card" | "bank_account" */
    @Column() public used: boolean
    @Column() public card?: StripeCardHash
}
