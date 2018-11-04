import { Cart } from '@mte/common/api/interfaces/cart'
import { CartItem } from '@mte/common/api/interfaces/cart-item'
import { Price } from '@mte/common/api/interfaces/price'
import { Product } from '@mte/common/api/interfaces/product'
import { Currency } from '@mte/common/constants/enums/currency'
import { ProductHelper } from '@mte/common/helpers/product.helper'
import { CartDisplayItem } from '@mte/common/models/ui/cart-display-item'

export class CartHelper {

    /**
     * @param {Product[]} items
     * @returns {CartDisplayItem<Product>[]}
     */
    public static getDisplayItems(items: Product[]): CartDisplayItem<Product>[] {
        const displayItems: CartDisplayItem<Product>[] = []

        items.forEach((item) => {
            const duplicateItemIndex = displayItems.findIndex(displayItem => displayItem.data._id === item._id)

            if (duplicateItemIndex > -1) {
                const duplicateItem = displayItems.find(displayItem => displayItem.data._id === item._id)

                displayItems[duplicateItemIndex] = {
                    ...duplicateItem,
                    quantity: duplicateItem.quantity + 1,
                    subTotal: {
                        amount: duplicateItem.subTotal.amount + (ProductHelper.getPrice(item) as Price).amount,
                        currency: duplicateItem.subTotal.currency,
                    } as Price,
                }
            }
            else {
                displayItems.push({
                    quantity: 1,
                    data: item,
                    subTotal: ProductHelper.getPrice(item) as Price,
                })
            }
        })

        return displayItems
    }

    public static getSubTotal(items: Product[]): Price {
        return items
            .map((p) => {
                return (ProductHelper.getPrice(p) as Price)
            })
            .reduce((prev: Price, current: Price) => {
                return {
                    currency: current.currency,
                    amount: prev.amount + current.amount
                }
            }, { amount: 0, currency: Currency.USD })
    }

    public static getTotal(
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
        }
    }

    public static getNumberAvailableToAdd(cart: Cart, item: CartItem): number {
        return !!cart ?
            item.stockQuantity - cart.items.filter((_item: CartItem) => _item._id === item._id).length
            : 0
    }
}
