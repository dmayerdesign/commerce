import { ObjectId } from 'mongodb'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Attribute as IAttribute } from './attribute.interface'

@Entity()
export class Attribute implements IAttribute {
  @ObjectIdColumn() public id: ObjectId
  @Column() public slug: string
  @Column() public singularName?: string
  @Column() public pluralName?: string
  @Column() public description?: string
}
