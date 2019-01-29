import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ObjectIdColumn, ObjectID, UpdateDateColumn } from 'typeorm'
import { UsabilityExperience } from '../usability-experience/usability-experience'
import { UsabilityTestBucket } from '../usability-test-bucket/usability-test-bucket'
import { UsabilityTest as IUsabilityTest } from './usability-test.interface'

@Entity()
export class UsabilityTest implements IUsabilityTest {
    @ObjectIdColumn() public id: ObjectID
    @Column(() => UsabilityExperience) public usabilityExperience: UsabilityExperience
    @Column() public description: string

    @ManyToMany(() => UsabilityTestBucket, x => x.id)
    @JoinColumn()
    public buckets: UsabilityTestBucket

    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
