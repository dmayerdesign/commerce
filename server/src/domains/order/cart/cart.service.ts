import { Inject, Injectable } from '@nestjs/common'
import { CartItem } from '@qb/common/api/interfaces/cart-item'
import { Product } from '@qb/common/api/interfaces/product'
import { GetCartItemsFromIdsRequest } from '@qb/common/api/requests/get-cart-items-from-ids.request'
import { QbRepository } from '../../../shared/data-access/repository'
import { ProductService } from '../../product/product.service'

@Injectable()
export class CartService {
    constructor(
        @Inject(ProductService) private _productRepository: QbRepository<Product>
    ) { }

    public async refresh(request: GetCartItemsFromIdsRequest): Promise<CartItem[]> {
        return this._productRepository.list(request)
    }

    public async getItem(id: string): Promise<CartItem> {
        return this._productRepository.get(id)
    }
}
