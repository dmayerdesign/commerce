import { ObjectID } from 'typeorm'
import { Entity } from './entity'

export interface Diff extends Entity {
  recordId: ObjectID
  previousValue: any
  currentValue: any
}
