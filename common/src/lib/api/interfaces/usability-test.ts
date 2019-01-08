import { Entity } from './entity'
import { UsabilityExperience } from './usability-experience'

export interface UsabilityTest extends Entity {
    usabilityExperience: UsabilityExperience
    description: string
    buckets: number
}
