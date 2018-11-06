import { Types } from '@mte/common/constants/inversify/types'
import { TaxonomyTerm } from '@mte/common/api/entities/taxonomy-term'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { ApiResponse } from '@mte/common/api/responses/api.response'
import { inject, injectable } from 'inversify'
import { DbClient } from '../data-access/db-client'
import { CrudService } from './crud.service'

/**
 * Methods for querying the `taxonomyterms` collection
 *
 * @export
 * @class TaxonomyTermService
 * @extends {CrudService<TaxonomyTerm>}
 */
@injectable()
export class TaxonomyTermService extends CrudService<TaxonomyTerm> {
    public model = TaxonomyTerm

    constructor(
        @inject(Types.DbClient) protected dbClient: DbClient<TaxonomyTerm>,
    ) {
        super()
    }

    /**
     * Get a single taxonomy term by slug.
     *
     * @param {string} slug The `slug` of the taxonomy term to be retrieved
     * @return {Promise<TaxonomyTerm>}
     */
    public getOneSlug(slug: string): Promise<ApiResponse<TaxonomyTerm>> {
        return new Promise<ApiResponse<TaxonomyTerm>>(async (resolve, reject) => {
            try {
                const taxonomyTerm = await this.dbClient.findOne(TaxonomyTerm, { slug })
                resolve(new ApiResponse(taxonomyTerm))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }
}
