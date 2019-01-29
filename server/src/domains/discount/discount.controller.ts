import { Controller, Inject } from '@nestjs/common'
import { Discount } from '@qb/common/domains/discount/discount'
import { discounts } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { DiscountRepository } from './discount.repository'

@Controller(discounts)
export class DiscountController extends QbController<Discount> {
  constructor(
    @Inject(DiscountRepository)
    protected readonly _repository: DiscountRepository
  ) { super() }
}
