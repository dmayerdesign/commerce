import { Product } from '../../api/entities/product'
import { Price } from '../../api/interfaces/price'

export interface CartDisplayProduct {
    quantity: number
    subTotal: Price
    data: Product
}
