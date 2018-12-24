import * as findOrCreate from 'mongoose-findorcreate'
import { model, plugin, prop, MongooseDocument, Ref } from '../../goosetype'
import { Attribute } from './attribute'

@plugin(findOrCreate)
@model()
export class AttributeValue extends MongooseDocument {
    @prop({ ref: Attribute }) public attribute: Ref<Attribute>
    @prop() public name: string
    @prop() public slug: string
    @prop() public description: string
    @prop() public value: any
}
