import { Column, JoinColumn, OneToMany } from 'typeorm'
import { ProductListFilterUi as IProductListFilterUi } from '../interfaces/product-list-filter-ui'
import { ProductListFilterType } from '../requests/models/product-list-filter'
import { AttributeValue } from './attribute-value'
import { ProductListFilterUiDisplayWhen } from './product-list-filter-ui-display-when'
import { SimpleAttributeValue } from './simple-attribute-value'
import { TaxonomyTerm } from './taxonomy-term'

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
