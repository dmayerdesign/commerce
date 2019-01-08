import { Column, Entity, JoinColumn, ManyToOne, ObjectIdColumn, ObjectID } from 'typeorm'
import { Attribute as IAttribute } from '../interfaces/attribute'
import { Attribute } from './attribute'

@Entity()
export class AttributeValue implements IAttribute {
  @ObjectIdColumn() public id: ObjectID

  @ManyToOne(() => Attribute, attribute => attribute.id)
  @JoinColumn()
  public attribute: Attribute

  @Column() public singularName: string
  @Column() public pluralName: string
  @Column() public slug: string
  @Column() public description: string
  @Column() public value: any
}
