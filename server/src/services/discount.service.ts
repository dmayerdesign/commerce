import { inject, injectable } from 'inversify'

import { Discount } from '@mte/common/api/entities/discount'
import { Types } from '@mte/common/constants/inversify/types'
import { DbClient } from '../data-access/db-client'
import { CrudService } from './crud.service'

/**
 * Service for fetching documents from the `discounts` collection
 */
@injectable()
export class DiscountService extends CrudService<Discount> {

    protected model = Discount

    constructor(
        @inject(Types.DbClient) protected dbClient: DbClient<Discount>
    ) {
        super()
    }

}
