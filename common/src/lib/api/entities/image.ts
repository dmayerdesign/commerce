import { Column, ColumnOptions, Entity, ObjectIdColumn, ObjectID } from 'typeorm'
import { getImageForSchema } from '../../helpers/image.helpers'
import { Image as IImage } from '../interfaces/image'

@Entity()
export class Image implements IImage {
  @ObjectIdColumn() public id: ObjectID
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public large?: string
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public medium?: string
  @Column({ transformer: { from: getImageForSchema } } as ColumnOptions) public thumbnail?: string
}
