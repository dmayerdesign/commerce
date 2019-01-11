import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ObjectIdColumn, ObjectID, UpdateDateColumn } from 'typeorm'
import { UsabilityTest as IUsabilityTest } from '../interfaces/usability-test'
import { UsabilityExperience } from './usability-experience'
import { UsabilityTestBucket } from './usability-test-bucket'

@Entity()
export class UsabilityTest implements IUsabilityTest {
    @ObjectIdColumn() public id: ObjectID
    @Column(() => UsabilityExperience) public usabilityExperience: UsabilityExperience
    @Column() public description: string

    @ManyToMany(() => UsabilityTestBucket, x => x.id)
    @JoinColumn()
    public buckets: number

    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
