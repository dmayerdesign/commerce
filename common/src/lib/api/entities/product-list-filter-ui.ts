import { arrayProp, prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { AttributeValue } from '../interfaces/attribute-value'
import { ProductListFilterUi as IProductListFilterUi } from '../interfaces/product-list-filter-ui'
import { ProductListFilterUiDisplayWhen } from '../interfaces/product-list-filter-ui-display-when'
import { SimpleAttributeValue } from '../interfaces/simple-attribute-value'
import { TaxonomyTerm as ITaxonomyTerm } from '../interfaces/taxonomy-term'
import { ProductListFilterType } from '../requests/models/product-list-filter'
import { TaxonomyTerm } from './taxonomy-term'

@schema()
export class ProductListFilterUi extends MongooseDocument implements IProductListFilterUi {
    @prop({ enum: ProductListFilterType }) public filterType: ProductListFilterType
    @prop() public enabled: boolean
    @prop() public displayAlways?: boolean
    @prop() public displayWhen?: ProductListFilterUiDisplayWhen
    @prop() public label?: string
    @arrayProp({ ref: TaxonomyTerm }) public taxonomyTermOptions?: Ref<ITaxonomyTerm>[]
    @arrayProp({ type: {} }) public attributeValueOptions?:
        (Ref<AttributeValue> | SimpleAttributeValue)[]
}
