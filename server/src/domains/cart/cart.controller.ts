import { Controller, Get, Inject, Query } from '@nestjs/common'
import { Product } from '@qb/common/api/entities/product'
import { carts } from '@qb/common/constants/api-endpoints'
import { Crud } from '@qb/common/constants/crud'
import { ProductListRequest } from '../product/product.list-request'
import { ProductRepository } from '../product/product.repository.generated'
import { CartController as CartControllerGenerated } from './cart.controller.generated'
import { CartRepository } from './cart.repository.generated'

@Controller(carts)
export class CartController extends CartControllerGenerated {
    constructor(
        @Inject(CartRepository) protected readonly _repository: CartRepository,
        @Inject(ProductRepository) private readonly _productRepository: ProductRepository
    ) { super(_repository) }

    @Get('refresh')
    public refresh(
        @Query(Crud.Params.listRequest) query: string,
    ): Promise<Product[]> {
        const request: ProductListRequest = JSON.parse(query)
        return this._productRepository.list(request)
    }
}
