import { prop, schema, MongooseDocument } from '../../goosetype'
import { ImageHelper } from '../../helpers/image.helper'

@schema(Image)
export class Image extends MongooseDocument {
    @prop({ get: ImageHelper.getImageForSchema }) public large?: string
    @prop({ get: ImageHelper.getImageForSchema }) public medium?: string
    @prop({ get: ImageHelper.getImageForSchema }) public thumbnail?: string
}
