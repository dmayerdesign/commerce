import { Controller, Get, Inject, Query } from '@nestjs/common'
import { Cart } from '@qb/common/api/entities/cart'
import { Product } from '@qb/common/api/entities/product'
import { carts } from '@qb/common/constants/api-endpoints'
import { Crud } from '@qb/common/constants/crud'
import { QbController } from '../../shared/controller/controller'
import { ProductListRequest } from '../product/product.list-request'
import { ProductRepository } from '../product/product.repository'
import { CartRepository } from './cart.repository'

@Controller(carts)
export class CartController extends QbController<Cart> {
    constructor(
        @Inject(CartRepository) protected readonly _repository: CartRepository,
        @Inject(ProductRepository) private readonly _productRepository: ProductRepository
    ) { super() }

    @Get('refresh')
    public refresh(
        @Query(Crud.Params.listRequest) query: string,
    ): Promise<Product[]> {
        const request: ProductListRequest = JSON.parse(query)
        return this._productRepository.list(request)
    }
}
