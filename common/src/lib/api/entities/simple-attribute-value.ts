import { prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { Attribute } from './attribute'

@schema()
export class SimpleAttributeValue {
    @Column({ ref: Attribute }) public attribute: Ref<Attribute>
    @Column() public value: any
}
