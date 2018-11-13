import { Response } from 'express'
import { inject, injectable } from 'inversify'
import {
    controller,
    httpGet,
    interfaces,
    queryParam,
    requestParam,
    response,
} from 'inversify-express-utils'

import { GetCartItemsFromIdsRequest } from '@mte/common/api/requests/get-cart-items-from-ids.request'
import { ApiEndpoints, Types } from '@mte/common/constants'
import { CartService } from '../services/cart.service'
import { ApiController } from './api.controller'

@injectable()
@controller(ApiEndpoints.Cart)
export class CartController extends ApiController implements interfaces.Controller {

    constructor(
        @inject(Types.CartService) private cartService: CartService,
    ) { super() }

    @httpGet('/refresh')
    public refresh(
        @queryParam('request') request: string,
        @response() res: Response,
    ): void {
        const parsedQuery: GetCartItemsFromIdsRequest = request ? JSON.parse(request) : {}
        this.handleApiResponse(this.cartService.refresh(parsedQuery), res)
    }

    @httpGet('/get-item/:id')
    public getOne(
        @requestParam('id') id: string,
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.cartService.getItem(id), res)
    }
}
