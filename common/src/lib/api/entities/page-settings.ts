import { arrayProp, prop, schema, MongooseDocument } from '../../goosetype'

@schema()
export class PageSettings {
    @Column() public banner: string
    @Column() public bannerOverlay: string
}
