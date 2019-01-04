import { model, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { UsabilityExperience } from './usability-experience'

@model(MongooseSchemaOptions.timestamped)
export class UsabilityTestBucket {
    @ObjectIdColumn() public id: ObjectID
    @Column() public description: string
    @Column({ ref: UsabilityExperience }) public usabilityExperience: Ref<UsabilityExperience>
    @Column() public likelihood: number
}
