import { ObjectId } from 'mongodb'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { UsabilityExperience } from '../usability-experience/usability-experience'
import { UsabilityTestBucket as IUsabilityTestBucket } from './usability-test-bucket.interface'

@Entity()
export class UsabilityTestBucket implements IUsabilityTestBucket {
    @ObjectIdColumn() public id: ObjectId
    @Column() public description: string
    @Column(() => UsabilityExperience) public usabilityExperience: UsabilityExperience
    @Column() public likelihood: number
}
