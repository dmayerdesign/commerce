import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm'
import { Diff as IDiff } from '../interfaces/diff'

@Entity()
export class Diff implements IDiff {
  @ObjectIdColumn() public id: ObjectID
  @Column() public recordId: ObjectID
  @Column() public previousValue: any
  @Column() public currentValue: any
}
