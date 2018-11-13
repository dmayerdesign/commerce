import { Types } from '@qb/common/constants/inversify/types'
import { TaxonomyTerm } from '@qb/common/api/entities/taxonomy-term'
import { ApiErrorResponse } from '@qb/common/api/responses/api-error.response'
import { ApiResponse } from '@qb/common/api/responses/api.response'
import { inject, injectable } from 'inversify'
import { QbRepository } from '../../shared/data-access/repository'
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
        @inject(Types.QbRepository) protected repository: QbRepository<TaxonomyTerm>,
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
                const taxonomyTerm = await this.repository.findOne(TaxonomyTerm, { slug })
                resolve(new ApiResponse(taxonomyTerm))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }
}
