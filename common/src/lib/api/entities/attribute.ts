import * as findOrCreate from 'mongoose-findorcreate'
import { model, plugin, prop, MongooseDocument } from '../../goosetype'

@plugin(findOrCreate)
@model(Attribute)
export class Attribute extends MongooseDocument {
    @prop() public singularName: string
    @prop() public pluralName: string
    @prop() public slug: string
    @prop() public description: string
}

export class CreateAttributeError extends Error { }
export class FindAttributeError extends Error { }
export class UpdateAttributeError extends Error { }
export class DeleteAttributeError extends Error { }
