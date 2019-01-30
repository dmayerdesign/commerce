import { Currency } from '@qb/common/constants/enums/currency'
import { Cart } from '@qb/common/domains/cart/cart'
import { CartItem } from '@qb/common/domains/cart/cart-item'
import { Price } from '@qb/common/domains/price/price'
import { Product } from '@qb/common/domains/product/product'
import { getPrice } from '@qb/common/helpers/product.helpers'
import { CartDisplayProduct } from '@qb/common/models/ui/cart-display-product'

export function getDisplayProducts(products: Product[]): CartDisplayProduct[] {
    const displayProducts: CartDisplayProduct[] = []

    products.forEach((item) => {
        const duplicateProductIndex = displayProducts.findIndex(
            displayProduct => displayProduct.data.id === item.id
        )

        if (duplicateProductIndex > -1) {
            const duplicateProduct = displayProducts.find(
                displayProduct => displayProduct.data.id === item.id
            ) as CartDisplayProduct

            displayProducts[duplicateProductIndex] = {
                ...duplicateProduct,
                quantity: duplicateProduct.quantity + 1,
                subTotal: {
                    amount: duplicateProduct.subTotal.amount + (getPrice(item) as Price).amount,
                    currency: duplicateProduct.subTotal.currency,
                } as Price,
            } as CartDisplayProduct
        }
        else {
            displayProducts.push({
                quantity: 1,
                data: item,
                subTotal: getPrice(item) as Price,
            })
        }
    })

    return displayProducts
}

export function getSubTotal(products: Product[]): Price {
    return products
        .map((p) => {
            return (getPrice(p) as Price)
        })
        .reduce((prev: Price, current: Price) => {
            return {
                currency: current.currency,
                amount: prev.amount + current.amount
            } as Price
        }, { amount: 0, currency: Currency.USD } as Price)
}

export function getTotal(
    subTotal: Price,
    shouldAddSalesTax: boolean,
    salesTaxPercentage: number,
): Price {
    const taxPercent = shouldAddSalesTax
        ? salesTaxPercentage
        : 0
    return {
        amount: subTotal.amount + (subTotal.amount * taxPercent / 100),
        currency: subTotal.currency,
    } as Price
}

export function getNumberAvailableToAdd(cart: Cart, item: CartItem): number {
    return !!cart ?
        item.stockQuantity - cart.products.filter((_item: CartItem) => _item.id === item.id).length
        : 0
}
