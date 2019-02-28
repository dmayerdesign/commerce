import { ObjectID } from 'mongodb'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Attribute as IAttribute } from './attribute.interface'

@Entity()
export class Attribute implements IAttribute {
  @ObjectIdColumn() public id: ObjectID
  @Column() public slug: string
  @Column() public singularName?: string
  @Column() public pluralName?: string
  @Column() public description?: string
}
