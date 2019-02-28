import { ObjectId } from 'mongodb'
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'
import { Test as ITest } from './test.interface'

@Entity()
export class Test implements ITest {
    @ObjectIdColumn() public id: ObjectId
    @Column() public name: string
    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
