import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm'
import { Attribute as IAttribute } from '../interfaces/attribute'

@Entity()
export class Attribute implements IAttribute {
  @ObjectIdColumn() public id: ObjectID
  @Column() public singularName: string
  @Column() public pluralName: string
  @Column() public slug: string
  @Column() public description: string
}
