import { prop, schema, MongooseDocument } from '../../goosetype'
import { Address as IAddress } from '../interfaces/address'

@schema(Address)
export class Address extends MongooseDocument implements IAddress {
    @prop() public name?: string
    @prop() public company?: string
    @prop() public street1: string
    @prop() public street2?: string
    @prop() public city: string
    @prop() public state: string
    @prop() public country: string
    @prop() public zip: string
    @prop() public phone?: string
}
