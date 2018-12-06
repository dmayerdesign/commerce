import { Document } from './document'
import { Ref } from './ref'
import { UsabilityExperience } from './usability-experience'

export interface UsabilityTest extends Document {
    usabilityExperience: Ref<UsabilityExperience>
    description: string
    buckets: number
}
