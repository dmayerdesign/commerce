import { Column, CreateDateColumn, Entity, ObjectIdColumn, ObjectID, UpdateDateColumn } from 'typeorm'
import { Timer as ITimer } from './timer.interface'

@Entity()
export class Timer implements ITimer {
    @ObjectIdColumn() public id: ObjectID
    @Column() public name: string
    @Column() public url: string
    @Column() public method: string
    @Column() public startedAt: number
    @Column() public duration: number
    @Column() public jsonData: string
    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
