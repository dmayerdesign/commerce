import { Column } from 'typeorm'
import { Address as IAddress } from '../interfaces/address'

export class Address implements IAddress {
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
