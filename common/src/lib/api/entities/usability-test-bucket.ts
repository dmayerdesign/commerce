import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm'
import { UsabilityTestBucket as IUsabilityTestBucket } from '../interfaces/usability-test-bucket'
import { UsabilityExperience } from './usability-experience'

@Entity()
export class UsabilityTestBucket implements IUsabilityTestBucket {
    @ObjectIdColumn() public id: ObjectID
    @Column() public description: string
    @Column(() => UsabilityExperience) public usabilityExperience: UsabilityExperience
    @Column() public likelihood: number
}
