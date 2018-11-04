import { MongooseDocument } from './mongoose-document'

export interface PageSettings extends MongooseDocument {
    banner: string
    bannerOverlay: string
}
