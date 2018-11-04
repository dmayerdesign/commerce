import { MongooseDocument } from './mongoose-document'

export interface CustomRegion extends MongooseDocument {
    isActive?: boolean
    isMetaRegion?: boolean
    childRegions?: CustomRegion[]
    key?: string
    className?: string
    apiModel?: string
    dataProperty?: string
    dataArrayProperty?: string
    pathToDataArrayPropertyLookupKey?: string
    dataArrayPropertyLookupValue?: string
    pathToDataPropertyValue?: string
    template?: string
}
