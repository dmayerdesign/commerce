import { arrayProp, prop, schema, MongooseDocument } from '../../goosetype'

@schema(PageSettings)
export class PageSettings extends MongooseDocument {
    @prop() public banner: string
    @prop() public bannerOverlay: string
}
