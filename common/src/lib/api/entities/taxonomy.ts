import * as findOrCreate from 'mongoose-findorcreate'
import { model, plugin, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'

@plugin(findOrCreate)
@model(Taxonomy, MongooseSchemaOptions.timestamped)
export class Taxonomy extends MongooseDocument {
    @prop() public singularName: string
    @prop() public pluralName: string
    @prop() public slug: string
    @prop() public description: string
}

export class CreateTaxonomyError extends Error { }
export class FindTaxonomyError extends Error { }
export class UpdateTaxonomyError extends Error { }
export class DeleteTaxonomyError extends Error { }
