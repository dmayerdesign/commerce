import { Controller, Get, Inject, Param } from '@nestjs/common'
import { products } from '@qb/common/constants/api-endpoints'
import { Price } from '@qb/common/domains/price/price.interface'
import { Product } from '@qb/common/domains/product/product'
import { QbController } from '../../shared/controller/controller'
import { ProductRepository } from './product.repository'
import { ProductService } from './product.service'

@Controller(products)
export class ProductController extends QbController<Product> {
  constructor(
    @Inject(ProductRepository) protected readonly _repository: ProductRepository,
    @Inject(ProductService) protected readonly _productService: ProductService,
  ) { super() }

  // TODO: Figure out streaming with TypeORM.
  // @Get('stream')
  // public stream(
  //   @Query(Params.LIST_REQUEST) query: string,
  //   @Response() response: IResponse,
  // ): Promise<void> {
  //   const request: ListRequest<Product> = JSON.parse(query)
  //   return this._productService.getProducts(request, response)
  // }

  /**
   * Get the product along with any variations.
   */
  @Get(':slug/detail')
  public getDetail(
    @Param('slug') slug: string
  ): Promise<Product | undefined> {
    return this._productService.getProductDetail(slug)
  }

  @Get('price-range')
  public getPriceRange(): Promise<Price[]> {
    return this._productService.getPriceRangeForShop()
  }
}
