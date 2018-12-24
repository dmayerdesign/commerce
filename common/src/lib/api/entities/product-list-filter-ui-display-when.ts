import { prop, schema, MongooseDocument } from '../../goosetype'

@schema()
export class ProductListFilterUiDisplayWhen extends MongooseDocument {
    @prop() public taxonomyTermSlug: string
}
