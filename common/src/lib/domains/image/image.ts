import { ObjectID } from 'mongodb'
import { Column, ColumnOptions, Entity, ObjectIdColumn } from 'typeorm'
import { getImageForSchema } from '../../helpers/image.helpers'
import { Image as IImage } from './image.interface'

@Entity()
export class Image implements IImage {
  @ObjectIdColumn() public id: ObjectID
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public large?: string
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public medium?: string
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public thumbnail?: string
}
