import { Controller, Get, Inject, Param } from '@nestjs/common'
import { Product } from '@qb/common/api/entities/product'
import { Price } from '@qb/common/api/interfaces/price'
import { products } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'
import { ProductService } from './product.service'

@Controller(products)
export class ProductController extends QbController<Product> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<Product>,
    @Inject(ProductService) protected readonly _productService: ProductService,
  ) {
    super()
    this._repository.configureForTypeOrmEntity(Product)
  }

  // TODO: Figure out streaming with TypeORM.
  // @Get('stream')
  // public stream(
  //   @Query(Crud.Params.listRequest) query: string,
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
