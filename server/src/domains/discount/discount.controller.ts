import { Controller, Inject } from '@nestjs/common'
import { Discount } from '@qb/common/api/entities/discount'
import { Discount as IDiscount } from '@qb/common/api/interfaces/discount'
import { discounts } from '@qb/common/constants/api-endpoints'
import { QbRepository } from '../../shared/data-access/repository'
import { QbController } from '../../shared/controller/controller'

@Controller(discounts)
export class DiscountController extends QbController<IDiscount> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<IDiscount>
  ) {
    super()
    this._repository.configureForGoosetypeEntity(Discount)
  }
}
