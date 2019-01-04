import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm'

@Entity()
export class Attribute {
  @ObjectIdColumn() public id: ObjectID
  @Column() public singularName: string
  @Column() public pluralName: string
  @Column() public slug: string
  @Column() public description: string
}
