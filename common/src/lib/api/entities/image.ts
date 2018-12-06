import { prop, schema, MongooseDocument } from '../../goosetype'
import { getImageForSchema } from '../../helpers/image.helpers'

@schema()
export class Image extends MongooseDocument {
    @prop({ get: getImageForSchema }) public large?: string
    @prop({ get: getImageForSchema }) public medium?: string
    @prop({ get: getImageForSchema }) public thumbnail?: string
}
