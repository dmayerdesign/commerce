import { Document } from '@qb/common/goosetype/interfaces'

export interface PageSettings extends Document {
    banner: string
    bannerOverlay: string
}
