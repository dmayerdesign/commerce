import { Document } from './document'
import { Ref } from './ref'
import { UsabilityExperience } from './usability-experience'

export interface UsabilityTestBucket extends Document {
    description: string
    usabilityExperience: Ref<UsabilityExperience>
    likelihood: number
}
