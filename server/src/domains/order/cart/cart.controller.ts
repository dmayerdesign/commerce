import { Controller, Get, Inject, Query } from '@nestjs/common'
import { Product } from '@qb/common/api/entities/product'
import { Product as IProduct } from '@qb/common/api/interfaces/product'
import { carts } from '@qb/common/constants/api-endpoints'
import { Crud } from '@qb/common/constants/crud'
import { QbRepository } from '../../../shared/data-access/repository'
import { ProductListRequest } from '../../product/product.request.list'

@Controller(carts)
export class CartController {

    constructor(
        @Inject(QbRepository) protected readonly _productRepository: QbRepository<IProduct>
    ) {
        this._productRepository.configureForGoosetypeEntity(Product)
    }

    @Get('refresh')
    public refresh(
        @Query(Crud.Params.listRequest) query: string,
    ): Promise<IProduct[]> {
        const request: ProductListRequest = JSON.parse(query)
        return this._productRepository.list(request)
    }
}
