import { ProductsFilterType } from '../../constants/enums/products-filter-type'
import { arrayProp, prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { ProductsFilter as IProductsFilter } from '../interfaces/products-filter'
import { AttributeValue } from './attribute-value'
import { ProductsFilterDisplayWhen } from './products-filter-display-when'
import { SimpleAttributeValue } from './simple-attribute-value'
import { TaxonomyTerm } from './taxonomy-term'

@schema(ProductsFilter)
export class ProductsFilter extends MongooseDocument implements IProductsFilter {
    @prop({ enum: ProductsFilterType }) public filterType: ProductsFilterType
    @prop() public enabled: boolean
    @prop() public displayAlways?: boolean
    @prop() public displayWhen?: ProductsFilterDisplayWhen
    @prop() public label?: string
    @arrayProp({ itemsRef: TaxonomyTerm }) public taxonomyTermOptions?: Ref<TaxonomyTerm>[]
    @arrayProp({ itemsType: {} }) public attributeValueOptions?: (Ref<AttributeValue> | SimpleAttributeValue)[]
}
