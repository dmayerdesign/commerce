import { Types } from '@qb/common/constants/inversify/types'
import { Taxonomy } from '@qb/common/api/entities/taxonomy'
import { Inject, Injectable } from '@nestjs/common'
import { QbRepository } from '../../shared/data-access/repository'
import { CrudService } from './crud.service'

/**
 * Methods for querying the `taxonomies` collection
 *
 * @export
 * @class TaxonomyService
 * @extends {CrudService<Taxonomy>}
 */
@injectable()
export class TaxonomyService extends CrudService<Taxonomy> {
    public model = Taxonomy

    constructor(
        @Inject(QbRepository) protected repository: QbRepository<Taxonomy>,
    ) {
        super()
    }
}
