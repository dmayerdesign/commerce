import { Column, Entity, JoinColumn, ManyToOne, ObjectIdColumn, ObjectID } from 'typeorm'
import { Attribute } from './attribute'

@Entity()
export class AttributeValue {
  @ObjectIdColumn() public id: ObjectID

  @ManyToOne(() => Attribute, attribute => attribute.id)
  @JoinColumn()
  public attribute: Attribute

  @Column() public name: string
  @Column() public slug: string
  @Column() public description: string
  @Column() public value: any
}
