// import { Request, Response } from 'express'
// import { Inject, Injectable } from '@nestjs/common'
// import {
//     controller,
//     httpDelete,
//     httpGet,
//     httpPost,
//     interfaces,
//     request,
//     requestParam,
//     response,
// } from 'inversify-express-utils'

// import { Product } from '@qb/common/domains/product/product'
// import { GetProductsFromIdsRequest, GetProductsRequest } from '@qb/common/domains/data-access/requests/get-products.request'
// import { ApiEndpoints, Types } from '@qb/common/constants'
// import { SeedService } from '../services/seed.service'
// import { ProductService } from '../services/product.service'
// import { Controller } from '../../../shared/controller/controller'

// @injectable()
// @controller(ProductsAdmin/*, Types.isOwner*/)
// export class ProductsAdminController extends Controller implements interfaces.Controller {

//     constructor(
//         @Inject(ProductService) private productService: ProductService,
//         @Inject(SeedService) private wms: SeedService,
//     ) { super() }

//     @httpGet('/get-by-slug/:slug')
//     public getOneBySlug(
//         @requestParam('slug') slug: string,
//         @response() res: Response,
//     ): void {
//         this.handleApiResponse(this.productService.getOneSlug(slug), res)
//     }

//     @httpGet('/get-by-id/:id')
//     public getOneById(
//         @requestParam('id') id: string,
//         @response() res: Response,
//     ): void {
//         this.handleApiResponse(this.productService.getOne(id), res)
//     }

//     @httpDelete('/:id')
//     public delete(
//         @requestParam('id') id: string,
//         @response() res: Response,
//     ): void {
//         this.handleApiResponse(this.productService.deleteOne(id), res)
//     }

//     @httpGet('/update-test')
//     public updateTest(
//         @response() res: Response,
//     ): void {
//         this.productService.updateTestProduct({
//                 isStandalone: true,
//                 sku: 'TEST_001',
//             })
//             .then(data => res.json(data))
//             .catch(err => res.status(500).json(err))
//     }

//     @httpPost('/migrate')
//     public migrateProducts(
//         @response() res: Response,
//     ): void {
//         this.handleApiResponse(this.wms.seed(), res)
//     }
// }
