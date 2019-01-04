import { model, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'

@model(MongooseSchemaOptions.timestamped)
export class UsabilityExperience {
    @ObjectIdColumn() public id: ObjectID
    @Column() public description: string
}
