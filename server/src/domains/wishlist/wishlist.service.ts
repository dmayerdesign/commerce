import { Wishlist } from '@qb/common/api/entities/wishlist'
import { Types } from '@qb/common/constants/inversify/types'
import { inject, injectable } from 'inversify'
import { QbRepository } from '../../shared/data-access/repository'
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
        @inject(Types.QbRepository) protected repository: QbRepository<Wishlist>,
    ) {
        super()
    }
}
