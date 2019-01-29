import { AttributeValue } from '../attribute-value/attribute-value.interface'
import { Attribute } from '../attribute/attribute.interface'
import { Entity } from '../data-access/entity.interface'
import { Dimensions } from '../dimensions/dimensions.interface'
import { Image } from '../image/image.interface'
import { Price } from '../price/price.interface'
import { SimpleAttributeValue } from '../simple-attribute-value/simple-attribute-value.interface'
import { TaxonomyTerm } from '../taxonomy-term/taxonomy-term.interface'
import { Units } from '../units/units.interface'
import { Weight } from '../weight/weight.interface'

export interface Product extends Entity {
    // Aesthetic.
    name: string
    slug: string
    description: string
    featuredImages: Image[]
    images: Image[]

    // Organizational.
    sku: string
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
