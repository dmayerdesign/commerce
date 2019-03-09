import { Controller as NestController, Inject } from '@nestjs/common'
import { Discount } from '@qb/common/domains/discount/discount'
import { discounts } from '@qb/common/constants/api-endpoints'
import { Controller } from '../../shared/controller/controller'
import { DiscountRepository } from './discount.repository'

@NestController(discounts)
export class DiscountController extends Controller<Discount> {
  constructor(
    @Inject(DiscountRepository)
    protected readonly _repository: DiscountRepository
  ) { super() }
}
