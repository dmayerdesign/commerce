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
export class Product extends MongooseDocument {
    // Aesthetic.
    @prop() public name: string
    @prop() public slug: string
    @prop() public description: string
    @arrayProp({ type: Image }) public featuredImages: Image[]
    @arrayProp({ type: Image }) public images: Image[]

    // Organizational.
    @prop({ unique: true }) public sku: string
    @prop({ enum: ProductClass }) public class: ProductClass
    @prop() public isStandalone: boolean
    @prop() public isParent: boolean
    @prop() public parentSku: string
    @prop({ ref: Product }) public parent: Ref<Product>
    @prop({ default: 'Product' }) public cartrefModelName: string

    // Financial.
    @prop() public price: Price
    @arrayProp({ type: Price }) public priceRange: Price[]
    @prop() public salePrice: Price
    @arrayProp({ type: Price }) public salePriceRange: Price[]
    @prop() public isOnSale: boolean
    @arrayProp({ type: String }) public variationSkus: string[]
    @arrayProp({ ref: Product }) public variations: Ref<Product>[]
    @prop() public isVariation: boolean
    @prop() public isDefaultVariation: boolean

    // Attributes.
    /// Own attributes.
    @arrayProp({ ref: AttributeValue }) public attributeValues: Ref<AttributeValue>[]
    @arrayProp({ type: SimpleAttributeValue }) public simpleAttributeValues: SimpleAttributeValue[]
    /// Variation attributes.
    @arrayProp({ type: String }) public variableProperties: string[]
    @arrayProp({ ref: Attribute }) public variableAttributes: Ref<Attribute>[]
    @arrayProp({ ref: AttributeValue }) public variableAttributeValues: Ref<AttributeValue>[]
    @arrayProp({ type: SimpleAttributeValue }) public variableSimpleAttributeValues: SimpleAttributeValue[]

    // Taxonomy.
    @arrayProp({ ref: TaxonomyTerm }) public taxonomyTerms: Ref<TaxonomyTerm>[]
    @arrayProp({ type: String }) public taxonomyTermSlugs: string[]

    // Shipping.
    @prop() public units: Units
    @prop() public dimensions: Dimensions
    @prop() public shippingWeight: Weight
    @prop() public netWeight: Weight

    // Additional tax.
    @prop() public additionalTax: number

    // Sales.
    @prop() public stockQuantity: number
    @prop() public totalSales: number
    @prop() public existsInStripe: boolean
}
