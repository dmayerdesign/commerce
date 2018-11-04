import { prop, schema, MongooseDocument } from '../../goosetype'
import { ProductsFilterDisplayWhen as IProductsFilterDisplayWhen } from '../interfaces/products-filter-display-when'

@schema(ProductsFilterDisplayWhen)
export class ProductsFilterDisplayWhen extends MongooseDocument implements IProductsFilterDisplayWhen {
    @prop() public taxonomyTermSlug: string
}
