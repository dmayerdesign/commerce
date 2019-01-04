import { arrayProp, prop, schema, MongooseDocument, Ref } from '../../goosetype'
import { AttributeValue } from '../interfaces/attribute-value'
import { ProductListFilterUi as IProductListFilterUi } from '../interfaces/product-list-filter-ui'
import { ProductListFilterUiDisplayWhen } from '../interfaces/product-list-filter-ui-display-when'
import { SimpleAttributeValue } from '../interfaces/simple-attribute-value'
import { TaxonomyTerm as ITaxonomyTerm } from '../interfaces/taxonomy-term'
import { ProductListFilterType } from '../requests/models/product-list-filter'
import { TaxonomyTerm } from './taxonomy-term'

@schema()
export class ProductListFilterUi implements IProductListFilterUi {
    @Column({ enum: ProductListFilterType }) public filterType: ProductListFilterType
    @Column() public enabled: boolean
    @Column() public displayAlways?: boolean
    @Column() public displayWhen?: ProductListFilterUiDisplayWhen
    @Column() public label?: string
    @OneToMany({ ref: TaxonomyTerm }) public taxonomyTermOptions?: Ref<ITaxonomyTerm>[]
    @OneToMany({ type: {} }) public attributeValueOptions?:
        (Ref<AttributeValue> | SimpleAttributeValue)[]
}
