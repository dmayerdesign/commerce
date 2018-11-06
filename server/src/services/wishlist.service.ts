import { Wishlist } from '@mte/common/api/entities/wishlist'
import { Types } from '@mte/common/constants/inversify/types'
import { inject, injectable } from 'inversify'
import { DbClient } from '../data-access/db-client'
import { CrudService } from './crud.service'

/**
 * Methods for querying the `taxonomies` collection
 *
 * @export
 * @class WishlistService
 * @extends {CrudService<Wishlist>}
 */
@injectable()
export class WishlistService extends CrudService<Wishlist> {
    public model = Wishlist

    constructor(
        @inject(Types.DbClient) protected dbClient: DbClient<Wishlist>,
    ) {
        super()
    }
}
