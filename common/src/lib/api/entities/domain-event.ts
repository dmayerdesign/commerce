import { DomainEventVerb } from '@qb/common/constants/enums/domain-event-verb'
import { HttpVerb } from '@qb/common/modules/http/http.models'
import { Column, CreateDateColumn, Entity, ObjectIdColumn, ObjectID, UpdateDateColumn } from 'typeorm'
import { DomainEvent as IDomainEvent } from '../interfaces/domain-event'
import { Diff } from './diff'

@Entity()
export class DomainEvent implements IDomainEvent {
    @ObjectIdColumn() public id: ObjectID
    @Column({ enum: DomainEventVerb }) public verb: DomainEventVerb
    @Column({ enum: HttpVerb }) public httpVerb?: HttpVerb
    @Column() public httpRequest?: any
    @Column() public httpResponse?: any
    @Column() public diff: Diff
    @CreateDateColumn({ type: 'timestamp' }) public createdAt: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt: Date
}
