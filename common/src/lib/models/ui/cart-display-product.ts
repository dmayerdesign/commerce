import { Price } from '@qb/common/domains/price/price.interface'
import { Product } from '@qb/common/domains/product/product.interface'

export interface CartDisplayProduct {
    quantity: number
    subTotal: Price
    data: Product
}
