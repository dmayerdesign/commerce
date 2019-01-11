import { Column } from 'typeorm'
import { StripeCardHash } from './stripe-card-hash'

export class StripeCardToken {
    @Column() public object: string
    @Column() public id: string
    @Column() public client_ip: string
    @Column() public created: number
    @Column() public livemode: boolean
    @Column({ enum: ['card', 'bank_account'] }) public type: string
    @Column() public used: boolean
    @Column(() => StripeCardHash) public card?: StripeCardHash
}
