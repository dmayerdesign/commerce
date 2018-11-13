import { inject, injectable } from 'inversify'

import { Discount } from '@qb/common/api/entities/discount'
import { Types } from '@qb/common/constants/inversify/types'
import { QbRepository } from '../../shared/data-access/repository'
import { CrudService } from './crud.service'

/**
 * Service for fetching documents from the `discounts` collection
 */
@injectable()
export class DiscountService extends CrudService<Discount> {

    protected model = Discount

    constructor(
        @inject(Types.QbRepository) protected repository: QbRepository<Discount>
    ) {
        super()
    }

}
