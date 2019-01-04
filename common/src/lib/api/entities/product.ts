import * as mongooseDelete from 'mongoose-delete'
import { ProductClass } from '../../constants/enums/product-class'
import { arrayProp, model, plugin, pre, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { Dimensions } from './dimensions'
import { Image } from './image'
import { Price } from './price'
import { SimpleAttributeValue } from './simple-attribute-value'
import { TaxonomyTerm } from './taxonomy-term'
import { Units } from './units'
import { Weight } from './weight'

@pre('find', function() {
    this.populate('parent')
})
@pre('findOne', function() {
    this.populate('parent')
})
@pre('save', function(next) {
    const product = this
    if (!product.slug && product.isNew) {
        product.slug = product.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
    }
    if (product.slug && (product.isNew || product.isModified('slug'))) {
        product.slug = product.slug.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
    }
    if (product.isNew || product.isModified('class')) {
        product.isStandalone = product.class === 'standalone'
        product.isParent = product.class === 'parent'
        product.isVariation = product.class === 'variation'
    } else if (
        product.isModified('isStandalone') ||
        product.isModified('isParent') ||
        product.isModified('isVariation')
    ) {
        product.class = product.isVariation ? 'variation' : product.isParent ? 'parent' : 'standalone'
    }
    next()
})
@plugin(mongooseDelete)
@model(MongooseSchemaOptions.timestamped)
export class Product {
    @ObjectIdColumn() public id: ObjectID
    // Aesthetic.
    @Column() public name: string
    @Column() public slug: string
    @Column() public description: string
    @OneToMany({ type: Image }) public featuredImages: Image[]
    @OneToMany({ type: Image }) public images: Image[]

    // Organizational.
    @Column({ unique: true }) public sku: string
    @Column({ enum: ProductClass }) public class: ProductClass
    @Column() public isStandalone: boolean
    @Column() public isParent: boolean
    @Column() public parentSku: string
    @Column({ ref: Product }) public parent: Ref<Product>

    // Financial.
    @Column() public price: Price
    @OneToMany({ type: Price }) public priceRange: Price[]
    @Column() public salePrice: Price
    @OneToMany({ type: Price }) public salePriceRange: Price[]
    @Column() public isOnSale: boolean
    @OneToMany({ type: String }) public variationSkus: string[]
    @OneToMany({ ref: Product }) public variations: Ref<Product>[]
    @Column() public isVariation: boolean
    @Column() public isDefaultVariation: boolean

    // Attributes.
    /// Own attributes.
    @OneToMany({ ref: AttributeValue }) public attributeValues: Ref<AttributeValue>[]
    @OneToMany({ type: SimpleAttributeValue }) public simpleAttributeValues: SimpleAttributeValue[]
    /// Variation attributes.
    @OneToMany({ type: String }) public variableProperties: string[]
    @OneToMany({ ref: Attribute }) public variableAttributes: Ref<Attribute>[]
    @OneToMany({ ref: AttributeValue }) public variableAttributeValues: Ref<AttributeValue>[]
    @OneToMany({ type: SimpleAttributeValue }) public variableSimpleAttributeValues: SimpleAttributeValue[]

    // Taxonomy.
    @OneToMany({ ref: TaxonomyTerm }) public taxonomyTerms: Ref<TaxonomyTerm>[]
    @OneToMany({ type: String }) public taxonomyTermSlugs: string[]

    // Shipping.
    @Column() public units: Units
    @Column() public dimensions: Dimensions
    @Column() public shippingWeight: Weight
    @Column() public netWeight: Weight

    // Additional tax.
    @Column() public additionalTax: number

    // Sales.
    @Column() public stockQuantity: number
    @Column() public totalSales: number
    @Column() public existsInStripe: boolean
}
