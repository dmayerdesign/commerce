import { Types } from 'mongoose'
import { prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { Document } from '../interfaces/document'

@schema()
export class Diff extends MongooseDocument {
  @prop({ type: Types.ObjectId }) public recordId: Ref<Document>
  @prop() public previousValue: any
  @prop() public currentValue: any
}
