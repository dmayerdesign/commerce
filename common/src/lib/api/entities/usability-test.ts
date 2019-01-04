import { arrayProp, model, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { UsabilityExperience } from './usability-experience'
import { UsabilityTestBucket } from './usability-test-bucket'

@model(MongooseSchemaOptions.timestamped)
export class UsabilityTest {
    @ObjectIdColumn() public id: ObjectID
    @Column({ ref: UsabilityExperience }) public usabilityExperience: Ref<UsabilityExperience>
    @Column() public description: string
    @OneToMany({ ref: UsabilityTestBucket }) public buckets: number
}
