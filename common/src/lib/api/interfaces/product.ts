import { ProductClass } from '../../constants/enums/product-class'
import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { Dimensions } from './dimensions'
import { Entity } from './entity'
import { Image } from './image'
import { Price } from './price'
import { SimpleAttributeValue } from './simple-attribute-value'
import { TaxonomyTerm } from './taxonomy-term'
import { Units } from './units'
import { Weight } from './weight'

export interface Product extends Entity {
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
    parent: Product

    // Financial.
    price: Price
    priceRange: Price[]
    salePrice: Price
    salePriceRange: Price[]
    isOnSale: boolean
    variationSkus: string[]
    variations: Product[]
    isVariation: boolean
    isDefaultVariation: boolean

    // Attributes.
    /// Own attributes.
    attributeValues: AttributeValue[]
    simpleAttributeValues: SimpleAttributeValue[]
    /// Variation attributes.
    variableProperties: string[]
    variableAttributes: Attribute[]
    variableAttributeValues: AttributeValue[]
    variableSimpleAttributeValues: SimpleAttributeValue[]

    // Taxonomy.
    taxonomyTerms: TaxonomyTerm[]
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
