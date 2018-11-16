import { Get, Inject, Injectable, Param, Query, Response } from '@nestjs/common'
import { Cart } from '@qb/common/api/entities/cart'
import { Cart as ICart } from '@qb/common/api/interfaces/cart'
import { Product as IProduct } from '@qb/common/api/interfaces/product'
import { GetCartItemsFromIdsRequest } from '@qb/common/api/requests/get-cart-items-from-ids.request'
import { carts } from '@qb/common/constants/api-endpoints'
import { Response as IResponse } from 'express'
import { QbController } from '../../../shared/controller/controller'
import { QbRepository } from '../../../shared/data-access/repository'
import { CartService } from '../cart/cart.service'

@Injectable()
@controller(carts)
export class CartController extends QbController<ICart> {

    constructor(
        @Inject(CartService) private cartService: CartService,
        @Inject(QbRepository) protected readonly _repository: QbRepository<ICart>
    ) {
        super()
        this._repository.configureForGoosetypeEntity(Cart)
    }

    @Get('/refresh')
    public refresh(
        @Query('request') request: string,
        @Response() res: IResponse,
    ): Promise<IProduct[]> {
        const parsedQuery: GetCartItemsFromIdsRequest = request ? JSON.parse(request) : {}
        return this.cartService.refresh(parsedQuery)
    }

    @Get('/get-item/:id')
    public getOne(
        @Param('id') id: string,
        @Response() res: IResponse,
    ): void {
        this.handleApiResponse(this.cartService.getItem(id), res)
    }
}
