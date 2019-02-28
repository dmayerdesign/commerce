import { ObjectId } from 'mongodb'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Diff as IDiff } from './diff.interface'

@Entity()
export class Diff implements IDiff {
  @ObjectIdColumn() public id: ObjectId
  @Column() public recordId: any // TODO: https://github.com/typeorm/typeorm/issues/2787
  @Column() public previousValue: any
  @Column() public currentValue: any
}
