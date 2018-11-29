import { Controller, Inject } from '@nestjs/common'
import { Discount } from '@qb/common/api/entities/discount'
import { Discount as IDiscount } from '@qb/common/api/interfaces/discount'
import { discounts } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'

@Controller(discounts)
export class DiscountController extends QbController<IDiscount> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<IDiscount>
  ) {
    super()
    this._repository.configureForGoosetypeEntity(Discount)
  }
}
