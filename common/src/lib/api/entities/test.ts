import { Column, CreateDateColumn, Entity, ObjectIdColumn, ObjectID, UpdateDateColumn } from 'typeorm'
import { Test as ITest } from '../interfaces/test'

@Entity()
export class Test implements ITest {
    @ObjectIdColumn() public id: ObjectID
    @Column() public name: string
    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
