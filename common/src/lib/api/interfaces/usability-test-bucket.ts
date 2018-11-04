import { MongooseDocument } from './mongoose-document'
import { Ref } from './ref'
import { UsabilityExperience } from './usability-experience'

export interface UsabilityTestBucket extends MongooseDocument {
    description: string
    usabilityExperience: Ref<UsabilityExperience>
    likelihood: number
}
