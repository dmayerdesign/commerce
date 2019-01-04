import * as findOrCreate from 'mongoose-findorcreate'
import { model, plugin, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'

@plugin(findOrCreate)
@model(MongooseSchemaOptions.timestamped)
export class Taxonomy {
    @ObjectIdColumn() public id: ObjectID
    @Column() public singularName: string
    @Column() public pluralName: string
    @Column() public slug: string
    @Column() public description: string
}
