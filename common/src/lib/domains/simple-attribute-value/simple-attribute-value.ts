import { Column, JoinColumn, ManyToOne } from 'typeorm'
import { Attribute } from '../attribute/attribute'
import { SimpleAttributeValue as ISimpleAttributeValue } from './simple-attribute-value.interface'

export class SimpleAttributeValue implements ISimpleAttributeValue {
    @ManyToOne(() => Attribute, attribute => attribute.id)
    @JoinColumn()
    public attribute: Attribute

    @Column() public value: any
}
