import { Types } from '@mte/common/constants/inversify/types'
import { Taxonomy } from '@mte/common/api/entities/taxonomy'
import { inject, injectable } from 'inversify'
import { DbClient } from '../data-access/db-client'
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
        @inject(Types.DbClient) protected dbClient: DbClient<Taxonomy>,
    ) {
        super()
    }
}
