import { Response } from 'express'
import { inject, injectable } from 'inversify'
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    interfaces,
    queryParam,
    requestBody,
    requestParam,
    response,
} from 'inversify-express-utils'

import { GetOrdersRequest } from '@mte/common/api/requests/get-orders.request'
import { PlaceOrderRequest } from '@mte/common/api/requests/place-order.request'
import { ApiEndpoints, Types } from '@mte/common/constants'
import { OrderService } from '../services/order.service'
import { ApiController } from './api.controller'

@injectable()
@controller(ApiEndpoints.Orders)
export class OrdersController extends ApiController implements interfaces.Controller {

    constructor(
        @inject(Types.OrderService) private orderService: OrderService,
    ) { super() }

    @httpGet('/')
    public get(
        @queryParam('request') request: string,
        @response() res: Response,
    ): void {
        const parsedQuery: GetOrdersRequest = request ? JSON.parse(request) : {}
        this.handleApiResponse(this.orderService.get(parsedQuery), res)
    }

    @httpGet('/:id')
    public getOne(
        @requestParam('id') id: string,
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.orderService.getOne(id), res)
    }

    @httpPost('/place')
    public place(
        @requestBody() body: PlaceOrderRequest,
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.orderService.place(body), res)
    }


    @httpDelete('/:id')
    public delete(
        @requestParam('id') id: string,
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.orderService.deleteOne(id), res)
    }
}
