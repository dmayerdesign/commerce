import { Entity } from '../data-access/entity.interface'

export interface Diff extends Entity {
  recordId: any
  previousValue: any
  currentValue: any
}
