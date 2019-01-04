import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm'

@Entity()
export class Diff {
  @ObjectIdColumn() public id: ObjectID
  @Column() public recordId: ObjectID
  @Column() public previousValue: any
  @Column() public currentValue: any
}
