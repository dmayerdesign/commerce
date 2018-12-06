import { arrayProp, prop, schema, MongooseDocument } from '../../goosetype'

@schema()
export class PageSettings extends MongooseDocument {
    @prop() public banner: string
    @prop() public bannerOverlay: string
}
