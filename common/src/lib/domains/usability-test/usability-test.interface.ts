import { Entity } from '../data-access/entity.interface'
import { UsabilityExperience } from '../usability-experience/usability-experience.interface'
import { UsabilityTestBucket } from '../usability-test-bucket/usability-test-bucket.interface'

export interface UsabilityTest extends Entity {
    usabilityExperience: UsabilityExperience
    description: string
    buckets: UsabilityTestBucket
}
