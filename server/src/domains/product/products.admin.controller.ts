import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    interfaces,
    request,
    requestParam,
    response,
} from 'inversify-express-utils'

import { Product } from '@mte/common/api/entities/product'
import { GetProductsFromIdsRequest, GetProductsRequest } from '@mte/common/api/requests/get-products.request'
import { ApiEndpoints, Types } from '@mte/common/constants'
import { HyzershopMigrationService } from '../services/hyzershop-migration.service'
import { ProductService } from '../services/product.service'
import { ApiController } from './api.controller'

@injectable()
@controller(ApiEndpoints.ProductsAdmin/*, Types.isOwner*/)
export class ProductsAdminController extends ApiController implements interfaces.Controller {

    constructor(
        @inject(Types.ProductService) private productService: ProductService,
        @inject(Types.HyzershopMigrationService) private wms: HyzershopMigrationService,
    ) { super() }

    @httpGet('/get-by-slug/:slug')
    public getOneBySlug(
        @requestParam('slug') slug: string,
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.productService.getOneSlug(slug), res)
    }

    @httpGet('/get-by-id/:id')
    public getOneById(
        @requestParam('id') id: string,
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.productService.getOne(id), res)
    }

    @httpDelete('/:id')
    public delete(
        @requestParam('id') id: string,
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.productService.deleteOne(id), res)
    }

    @httpGet('/update-test')
    public updateTest(
        @response() res: Response,
    ): void {
        this.productService.updateTestProduct({
                isStandalone: true,
                sku: 'TEST_001',
            })
            .then(data => res.json(data))
            .catch(err => res.status(500).json(err))
    }

    @httpPost('/migrate')
    public migrateProducts(
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.wms.createProductsFromExportedJSON(), res)
    }
}
