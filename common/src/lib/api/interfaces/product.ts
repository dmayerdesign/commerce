import { ProductClass } from '../../constants/enums/product-class'
import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { Dimensions } from './dimensions'
import { Image } from './image'
import { MongooseDocument } from './mongoose-document'
import { Price } from './price'
import { Ref } from './ref'
import { SimpleAttributeValue } from './simple-attribute-value'
import { TaxonomyTerm } from './taxonomy-term'
import { Units } from './units'
import { Weight } from './weight'

export interface Product extends MongooseDocument {
	// Aesthetic.
    name: string
    slug: string
    description: string
    featuredImages: Image[]
    images: Image[]

	// Organizational.
    sku: string
    class: ProductClass
    isStandalone: boolean
    isParent: boolean
    parentSku: string
    parent: Ref<Product>
    cartItemsRefModelName: string

    // Financial.
    price: Price
    priceRange: Price[]
    salePrice: Price
    salePriceRange: Price[]
    isOnSale: boolean
    variationSkus: string[]
    variations: Ref<Product>[]
    isVariation: boolean
    isDefaultVariation: boolean

	// Attributes.
	/// Own attributes.
    attributeValues: Ref<AttributeValue>[]
    simpleAttributeValues: SimpleAttributeValue[]
    /// Variation attributes.
    variableProperties: string[]
    variableAttributes: Ref<Attribute>[]
    variableAttributeValues: Ref<AttributeValue>[]
    variableSimpleAttributeValues: SimpleAttributeValue[]

	// Taxonomy.
    taxonomyTerms: Ref<TaxonomyTerm>[]
    taxonomyTermSlugs: string[] // TODO: remove (used for convenience in HyzerShop migration for building image urls)

	// Shipping.
    units: Units
    dimensions: Dimensions
    shippingWeight: Weight
    netWeight: Weight

	// Additional tax.
    additionalTax: number

	// Sales.
    stockQuantity: number
    totalSales: number
    existsInStripe: boolean
}
