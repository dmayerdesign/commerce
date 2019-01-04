import { Column } from 'typeorm'

export class Address {
  @Column() public name?: string
  @Column() public company?: string
  @Column() public street1: string
  @Column() public street2?: string
  @Column() public city: string
  @Column() public state: string
  @Column() public country: string
  @Column() public zip: string
  @Column() public phone?: string
}
