import { Document } from '@qb/common/goosetype/interfaces'

export interface CustomRegion extends Document {
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
