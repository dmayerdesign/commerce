import { prop, schema, MongooseDocument } from '../../goosetype'

@schema()
export class ProductListFilterUiDisplayWhen {
    @Column() public taxonomyTermSlug: string
}
