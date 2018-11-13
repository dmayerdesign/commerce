import { Controller, Get, Inject, Param, Query, Response } from '@nestjs/common'
import { Product } from '@qb/common/api/entities/product'
import { Price } from '@qb/common/api/interfaces/price'
import { Product as IProduct } from '@qb/common/api/interfaces/product'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { Crud } from '@qb/common/constants/crud'
import { Response as IResponse } from 'express'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'
import { ProductService } from './product.service'

@Controller('api/products')
export class ProductController extends QbController<IProduct> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<IProduct>,
    @Inject(ProductService) protected readonly _productService: ProductService,
  ) {
    super()
    this._repository.configureForGoosetypeEntity(Product)
  }

  @Get('stream')
  public stream(
    @Query(Crud.Params.listRequest) query: string,
    @Response() response: IResponse,
  ): Promise<void> {
    const request: ListRequest<IProduct> = JSON.parse(query)
    return this._productService.getProducts(request, response)
  }

  /**
   * Get the product along with any variations.
   */
  @Get(':slug/detail')
  public getDetail(
    @Param('slug') slug: string
  ): Promise<IProduct> {
    return this._productService.getProductDetail(slug)
  }

  @Get('price-range')
  public getPriceRange(): Promise<Price[]> {
    return this._productService.getPriceRangeForShop()
  }
}
