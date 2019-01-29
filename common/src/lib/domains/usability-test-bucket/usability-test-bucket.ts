import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm'
import { UsabilityExperience } from '../usability-experience/usability-experience'
import { UsabilityTestBucket as IUsabilityTestBucket } from './usability-test-bucket.interface'

@Entity()
export class UsabilityTestBucket implements IUsabilityTestBucket {
    @ObjectIdColumn() public id: ObjectID
    @Column() public description: string
    @Column(() => UsabilityExperience) public usabilityExperience: UsabilityExperience
    @Column() public likelihood: number
}
