import * as findOrCreate from 'mongoose-findorcreate'
import { model, plugin, prop, MongooseDocument } from '../../goosetype'

@plugin(findOrCreate)
@model()
export class Address extends MongooseDocument {
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
