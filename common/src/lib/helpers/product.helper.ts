import { Price } from '@mte/common/api/interfaces/price'
import { Product } from '@mte/common/api/interfaces/product'
import { TaxonomyTerm } from '@mte/common/api/interfaces/taxonomy-term'
import { Currency } from '@mte/common/constants/enums/currency'
import { RangeLimit } from '@mte/common/constants/enums/range-limit'

export class ProductHelper {
    public static isProduct(obj: any): boolean {
        return obj.cartItemsRefModelName === 'Product'
            || (obj.isParent || obj.isVariation || obj.isStandalone)
    }

    public static getBrand(product: Product): TaxonomyTerm {
        return product ? product.taxonomyTerms.find((t: TaxonomyTerm) => t.slug.indexOf('brand') > -1) as TaxonomyTerm : null
    }

    public static hasPriceRange(product: Product): boolean {
        return product.isOnSale
            ? !!product.salePriceRange && !!product.salePriceRange.length
            : !!product.priceRange && !!product.priceRange.length
    }

    public static getPrice(product: Product): Price | Price[] {
        if (product.isOnSale) {
            if (this.hasPriceRange(product)) {
                return product.salePriceRange
            }
            if (product.salePrice) {
                return product.salePrice
            }
        }
        else if (this.hasPriceRange(product)) {
            return product.priceRange
        }
        else if (product.price) {
            return product.price
        }
        return {
            amount: 0,
            currency: Currency.USD,
        }
    }

    public static getPriceString(product: Product): string {
        if (this.hasPriceRange(product)) {
            return `$${(this.getPrice(product) as Price[])[RangeLimit.Min].amount.toFixed(2)} - $${(this.getPrice(product) as Price[])[RangeLimit.Max].amount.toFixed(2)}`
        }
        else {
            return `$${(this.getPrice(product) as Price).amount.toFixed(2)}`
        }
    }

    public static getName(product: Product): string {
        if (product.isParent || product.isStandalone || !product.parent || !(product.parent as Product)._id) {
            return product.name
        } else {
            return (product.parent as Product).name
        }
    }

    public static isAttributeValue(data: any): boolean {
        return !!data && !!data.slug
    }
    public static isSimpleAttributeValue(data: any): boolean {
        return !!data && !data.slug
    }
}
