import { model, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { UsabilityExperience } from './usability-experience'

@model(MongooseSchemaOptions.timestamped)
export class UsabilityTestBucket extends MongooseDocument {
    @prop() public description: string
    @prop({ ref: UsabilityExperience }) public usabilityExperience: Ref<UsabilityExperience>
    @prop() public likelihood: number
}

// Errors.

export class CreateUsabilityTestBucketError extends Error { }
export class FindUsabilityTestBucketError extends Error { }
export class UpdateUsabilityTestBucketError extends Error { }
export class DeleteUsabilityTestBucketError extends Error { }
