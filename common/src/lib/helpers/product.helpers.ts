import { Price } from '@qb/common/api/interfaces/price'
import { Product } from '@qb/common/api/interfaces/product'
import { TaxonomyTerm } from '@qb/common/api/interfaces/taxonomy-term'
import { Currency } from '@qb/common/constants/enums/currency'
import { RangeLimit } from '@qb/common/constants/enums/range-limit'

export function isProduct(obj: any): boolean {
    return obj.cartrefModelName === 'Product'
        || (obj.isParent || obj.isVariation || obj.isStandalone)
}

export function getBrand(product: Product): TaxonomyTerm {
    return product ? product.taxonomyTerms.find((t: TaxonomyTerm) => t.slug.indexOf('brand') > -1) as TaxonomyTerm : null
}

export function hasPriceRange(product: Product): boolean {
    return product.isOnSale
        ? !!product.salePriceRange && !!product.salePriceRange.length
        : !!product.priceRange && !!product.priceRange.length
}

export function getPrice(product: Product): Price | Price[] {
    if (product.isOnSale) {
        if (hasPriceRange(product)) {
            return product.salePriceRange
        }
        if (product.salePrice) {
            return product.salePrice
        }
    }
    else if (hasPriceRange(product)) {
        return product.priceRange
    }
    else if (product.price) {
        return product.price
    }
    return {
        amount: 0,
        currency: Currency.USD,
    } as Price
}

export function getPriceString(product: Product): string {
    if (hasPriceRange(product)) {
        return `$${(getPrice(product) as Price[])[RangeLimit.Min].amount.toFixed(2)} - $${(getPrice(product) as Price[])[RangeLimit.Max].amount.toFixed(2)}`
    }
    else {
        return `$${(getPrice(product) as Price).amount.toFixed(2)}`
    }
}

export function getName(product: Product): string {
    if (product.isParent || product.isStandalone || !product.parent || !(product.parent as Product)._id) {
        return product.name
    } else {
        return (product.parent as Product).name
    }
}

export function isAttributeValue(data: any): boolean {
    return !!data && !!data.slug
}
export function isSimpleAttributeValue(data: any): boolean {
    return !!data && !data.slug
}
