import { UsabilityExperience } from '../usability-experience/usability-experience.interface'

export interface UsabilityTestBucket {
    description: string
    usabilityExperience: UsabilityExperience
    likelihood: number
}
