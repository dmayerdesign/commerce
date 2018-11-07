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
@model(Product, MongooseSchemaOptions.timestamped)
export class Product extends MongooseDocument {
    // Aesthetic.
    @prop() public name: string
    @prop() public slug: string
    @prop() public description: string
    @arrayProp({ itemsType: Image }) public featuredImages: Image[]
    @arrayProp({ itemsType: Image }) public images: Image[]

    // Organizational.
    @prop({ unique: true }) public sku: string
    @prop({ enum: ProductClass }) public class: ProductClass
    @prop() public isStandalone: boolean
    @prop() public isParent: boolean
    @prop() public parentSku: string
    @prop({ ref: Product }) public parent: Ref<Product>
    @prop({ default: 'Product' }) public cartItemsRefModelName: string

    // Financial.
    @prop() public price: Price
    @arrayProp({ itemsType: Price }) public priceRange: Price[]
    @prop() public salePrice: Price
    @arrayProp({ itemsType: Price }) public salePriceRange: Price[]
    @prop() public isOnSale: boolean
    @arrayProp({ itemsType: String }) public variationSkus: string[]
    @arrayProp({ itemsRef: Product }) public variations: Ref<Product>[]
    @prop() public isVariation: boolean
    @prop() public isDefaultVariation: boolean

    // Attributes.
    /// Own attributes.
    @arrayProp({ itemsRef: AttributeValue }) public attributeValues: Ref<AttributeValue>[]
    @arrayProp({ itemsType: SimpleAttributeValue }) public simpleAttributeValues: SimpleAttributeValue[]
    /// Variation attributes.
    @arrayProp({ itemsType: String }) public variableProperties: string[]
    @arrayProp({ itemsRef: Attribute }) public variableAttributes: Ref<Attribute>[]
    @arrayProp({ itemsRef: AttributeValue }) public variableAttributeValues: Ref<AttributeValue>[]
    @arrayProp({ itemsType: SimpleAttributeValue }) public variableSimpleAttributeValues: SimpleAttributeValue[]

    // Taxonomy.
    @arrayProp({ itemsRef: TaxonomyTerm }) public taxonomyTerms: Ref<TaxonomyTerm>[]
    @arrayProp({ itemsType: String }) public taxonomyTermSlugs: string[]

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

export class CreateProductError extends Error { }
export class CreateProductsError extends Error { }
export class FindProductError extends Error { }
export class FindProductsError extends Error { }
export class UpdateProductError extends Error { }
export class UpdateProductsError extends Error { }
export class DeleteProductError extends Error { }
export class DeleteProductsError extends Error { }
