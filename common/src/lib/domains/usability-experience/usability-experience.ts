import { ObjectId } from 'mongodb'
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'
import { UsabilityExperience as IUsabilityExperience } from './usability-experience.interface'

@Entity()
export class UsabilityExperience implements IUsabilityExperience {
    @ObjectIdColumn() public id: ObjectId
    @Column() public description: string
    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
