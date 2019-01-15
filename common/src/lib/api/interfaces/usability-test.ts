import { Entity } from './entity'
import { UsabilityExperience } from './usability-experience'
import { UsabilityTestBucket } from './usability-test-bucket'

export interface UsabilityTest extends Entity {
    usabilityExperience: UsabilityExperience
    description: string
    buckets: UsabilityTestBucket
}
