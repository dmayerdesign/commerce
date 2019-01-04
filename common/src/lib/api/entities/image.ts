import { Column, ColumnOptions } from 'typeorm'
import { getImageForSchema } from '../../helpers/image.helpers'

// TODO: Make this an entity.
export class Image {
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public large?: string
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public medium?: string
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public thumbnail?: string
}
