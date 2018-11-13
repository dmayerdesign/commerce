import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import {
    controller,
    httpDelete,
    httpGet,
    interfaces,
    queryParam,
    request,
    requestParam,
    response,
} from 'inversify-express-utils'

import { AppConfig } from '@mte/app-config'
import { ApiEndpoints, Types } from '@mte/common/constants'
import { GetTaxonomyTermsFromIdsRequest, GetTaxonomyTermsRequest } from '@mte/common/api/requests/get-taxonomy-terms.request'
import { TaxonomyTermService } from '../services/taxonomy-term.service'
import { ApiController } from './api.controller'

@injectable()
@controller(ApiEndpoints.TaxonomyTerms)
export class TaxonomyTermsController extends ApiController implements interfaces.Controller {

    constructor(
        @inject(Types.TaxonomyTermService) private taxonomyTermService: TaxonomyTermService
    ) { super() }

    @httpGet('/')
    public get(
        @queryParam('request') request: string,
        @request() req: Request,
        @response() res: Response,
    ): void {
        const parsedQuery: GetTaxonomyTermsRequest | GetTaxonomyTermsFromIdsRequest = request
            ? JSON.parse(request)
            : new GetTaxonomyTermsRequest()

        if ((parsedQuery as GetTaxonomyTermsFromIdsRequest).ids) {
            // Get a list of taxonomy terms from the requested `id`s.
            this.handleApiResponse(this.taxonomyTermService.getIds(new GetTaxonomyTermsFromIdsRequest((parsedQuery as GetTaxonomyTermsFromIdsRequest))), res)
        }
        else {
            // Get a list of taxonomy terms.
            this.handleApiResponse(this.taxonomyTermService.get(new GetTaxonomyTermsRequest((parsedQuery as GetTaxonomyTermsRequest))), res)
        }
    }

    /**
     * Get a single taxonomy term.
     *
     * @param {string} slug
     * @param {Response} res
     * @memberof ProductsController
     */
    @httpGet('/:slug')
    public getOne(
        @requestParam('slug') slug: string,
        @response() res: Response,
    ): void {
        this.handleApiResponse(this.taxonomyTermService.getOneSlug(slug), res)
    }
}
