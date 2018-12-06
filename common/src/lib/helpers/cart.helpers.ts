import { Cart } from '@qb/common/api/interfaces/cart'
import { CartItem } from '@qb/common/api/interfaces/cart-item'
import { Price } from '@qb/common/api/interfaces/price'
import { Product } from '@qb/common/api/interfaces/product'
import { Currency } from '@qb/common/constants/enums/currency'
import { getPrice } from '@qb/common/helpers/product.helpers'
import { CartDisplayItem } from '@qb/common/models/ui/cart-display-item'

export function getDisplayItems(items: Product[]): CartDisplayItem<Product>[] {
    const displayItems: CartDisplayItem<Product>[] = []

    items.forEach((item) => {
        const duplicateItemIndex = displayItems.findIndex(displayItem => displayItem.data._id === item._id)

        if (duplicateItemIndex > -1) {
            const duplicateItem = displayItems.find(displayItem => displayItem.data._id === item._id)

            displayItems[duplicateItemIndex] = {
                ...duplicateItem,
                quantity: duplicateItem.quantity + 1,
                subTotal: {
                    amount: duplicateItem.subTotal.amount + (getPrice(item) as Price).amount,
                    currency: duplicateItem.subTotal.currency,
                } as Price,
            }
        }
        else {
            displayItems.push({
                quantity: 1,
                data: item,
                subTotal: getPrice(item) as Price,
            })
        }
    })

    return displayItems
}

export function getSubTotal(items: Product[]): Price {
    return items
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
        item.stockQuantity - cart.items.filter((_item: CartItem) => _item._id === item._id).length
        : 0
}
