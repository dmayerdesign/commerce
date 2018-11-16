import { Document } from '@qb/common/goosetype/interfaces'
import { Ref } from './ref'

export interface Diff extends Document {
  recordId: Ref<Document>
  previousValue: any
  currentValue: any
}
