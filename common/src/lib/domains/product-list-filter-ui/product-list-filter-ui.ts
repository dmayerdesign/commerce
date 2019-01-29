import { Column, JoinColumn, OneToMany } from 'typeorm'
import { AttributeValue } from '../attribute-value/attribute-value'
import { ProductListFilterUiDisplayWhen } from '../product-list-filter-ui-display-when/product-list-filter-ui-display-when'
import { ProductListFilterType } from '../product/product-list-filter'
import { SimpleAttributeValue } from '../simple-attribute-value/simple-attribute-value'
import { TaxonomyTerm } from '../taxonomy-term/taxonomy-term'
import {
    ProductListFilterUi as IProductListFilterUi
} from './product-list-filter-ui.interface'

export class ProductListFilterUi implements IProductListFilterUi {
    @Column({ enum: ProductListFilterType }) public filterType: ProductListFilterType
    @Column() public enabled: boolean
    @Column() public displayAlways?: boolean
    @Column(() => ProductListFilterUiDisplayWhen) public displayWhen?: ProductListFilterUiDisplayWhen
    @Column() public label?: string

    @OneToMany(() => TaxonomyTerm, taxonomyTerm => taxonomyTerm.id)
    @JoinColumn()
    public taxonomyTermOptions?: TaxonomyTerm[]

    @OneToMany(() => AttributeValue, attributeValue => attributeValue.id)
    @JoinColumn()
    public attributeValueOptions?: AttributeValue[]

    @Column(() => SimpleAttributeValue)
    public simpleAttributeValueOptions?: SimpleAttributeValue[]
}
