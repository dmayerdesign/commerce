import { model, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'

@model(MongooseSchemaOptions.timestamped)
export class Test {
    @ObjectIdColumn() public id: ObjectID
    @Column() public name: string
}
