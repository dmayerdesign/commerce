import { prop, schema, MongooseDocument } from '../../goosetype'
import { ProductsFilterDisplayWhen as IProductsFilterDisplayWhen } from '../interfaces/products-filter-display-when'

@schema()
export class ProductsFilterDisplayWhen extends MongooseDocument implements IProductsFilterDisplayWhen {
    @prop() public taxonomyTermSlug: string
}
