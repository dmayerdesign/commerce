import { Request, Response } from 'express'
import { Inject, Injectable } from '@nestjs/common'
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

import { Product } from '@qb/common/api/entities/product'
import { GetProductsFromIdsRequest, GetProductsRequest } from '@qb/common/api/requests/get-products.request'
import { ApiEndpoints, Types } from '@qb/common/constants'
import { HyzershopMigrationService } from '../services/hyzershop-migration.service'
import { ProductService } from '../services/product.service'
import { QbController } from '../../../shared/controller/controller'

@injectable()
@controller(ProductsAdmin/*, Types.isOwner*/)
export class ProductsAdminController extends QbController implements interfaces.Controller {

    constructor(
        @Inject(ProductService) private productService: ProductService,
        @Inject(HyzershopMigrationService) private wms: HyzershopMigrationService,
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
