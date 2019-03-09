import { Controller as NestController, Get, Inject, Query } from '@nestjs/common'
import { carts } from '@qb/common/constants/api-endpoints'
import { Params } from '@qb/common/constants/crud'
import { Cart } from '@qb/common/domains/cart/cart'
import { Product } from '@qb/common/domains/product/product'
import { Controller } from '../../shared/controller/controller'
import { ProductListRequest } from '../product/product.list-request'
import { ProductRepository } from '../product/product.repository'
import { CartRepository } from './cart.repository'

@NestController(carts)
export class CartController extends Controller<Cart> {
    constructor(
        @Inject(CartRepository) protected readonly _repository: CartRepository,
        @Inject(ProductRepository) private readonly _productRepository: ProductRepository
    ) { super() }

    @Get('refresh')
    public refresh(
        @Query(Params.LIST_REQUEST) query: string,
    ): Promise<Product[]> {
        const request: ProductListRequest = JSON.parse(query)
        return this._productRepository.list(request)
    }
}
