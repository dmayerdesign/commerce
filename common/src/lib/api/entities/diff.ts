import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { ObjectID } from 'typeorm'
import { Diff as IDiff } from '../interfaces/diff'

@Entity()
export class Diff implements IDiff {
  @ObjectIdColumn() public id: ObjectID
  @Column() public recordId: any // TODO: https://github.com/typeorm/typeorm/issues/2787
  @Column() public previousValue: any
  @Column() public currentValue: any
}
