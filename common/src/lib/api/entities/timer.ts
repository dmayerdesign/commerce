import { model, prop, MongooseDocument, MongooseSchemaOptions } from '../../goosetype'

@model(MongooseSchemaOptions.timestamped)
export class Timer {
    @ObjectIdColumn() public id: ObjectID
    @Column() public name: string
    @Column() public url: string
    @Column() public method: string
    @Column() public startedAt: number
    @Column() public duration: number
    @Column() public jsonData: string
}
