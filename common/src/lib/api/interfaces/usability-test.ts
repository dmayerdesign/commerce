import { MongooseDocument } from './mongoose-document'
import { Ref } from './ref'
import { UsabilityExperience } from './usability-experience'
import { UsabilityTestBucket } from './usability-test-bucket'

export interface UsabilityTest extends MongooseDocument {
    usabilityExperience: Ref<UsabilityExperience>
    description: string
    buckets: number
}
