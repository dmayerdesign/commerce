import { Column, Entity, JoinColumn, ManyToOne, ObjectIdColumn, ObjectID } from 'typeorm'
import { AttributeValue as IAttributeValue } from '../interfaces/attribute-value'
import { Attribute } from './attribute'

@Entity()
export class AttributeValue implements IAttributeValue {
  @ObjectIdColumn() public id: ObjectID

  @ManyToOne(() => Attribute, attribute => attribute.id)
  @JoinColumn()
  public attribute: Attribute

  @Column() public slug: string
  @Column() public value: any
  @Column() public name?: string
  @Column() public description?: string
}
