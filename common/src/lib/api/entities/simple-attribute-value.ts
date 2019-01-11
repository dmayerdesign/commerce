import { Column, JoinColumn, ManyToOne } from 'typeorm'
import { SimpleAttributeValue as ISimpleAttributeValue } from '../interfaces/simple-attribute-value'
import { Attribute } from './attribute'

export class SimpleAttributeValue implements ISimpleAttributeValue {
    @ManyToOne(() => Attribute, attribute => attribute.id)
    @JoinColumn()
    public attribute: Attribute

    @Column() public value: any
}
