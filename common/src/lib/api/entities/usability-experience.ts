import { Column, CreateDateColumn, Entity, ObjectIdColumn, ObjectID, UpdateDateColumn } from 'typeorm'
import { UsabilityExperience as IUsabilityExperience } from '../interfaces/usability-experience'

@Entity()
export class UsabilityExperience implements IUsabilityExperience {
    @ObjectIdColumn() public id: ObjectID
    @Column() public description: string
    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
