import { Types } from 'mongoose'
import { prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { Diff as IDiff } from '../interfaces/diff'

@schema(Diff)
export class Diff extends MongooseDocument implements IDiff {
  @prop({ type: Types.ObjectId }) public recordId: Ref<MongooseDocument>
  @prop() public previousValue: any
  @prop() public currentValue: any
}
