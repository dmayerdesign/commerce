import { MongooseDocument } from './mongoose-document'
import { Ref } from './ref'

export interface Diff {
  recordId: Ref<MongooseDocument>
  previousValue: any
  currentValue: any
}
