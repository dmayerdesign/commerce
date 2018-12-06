import { Body, Controller, Inject, Post } from '@nestjs/common'
import { Order } from '@qb/common/api/entities/order'
import { Order as IOrder } from '@qb/common/api/interfaces/order'
import { orders } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'
import { OrderService } from './order.service'

@Controller(orders)
export class OrderController extends QbController<IOrder> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<IOrder>,
    @Inject(OrderService) protected readonly _orderService: OrderService,
  ) {
    super()
    this._repository.configureForGoosetypeEntity(Order)
  }

  @Post()
  public createOne(
    @Body() body: Partial<IOrder>,
  ): Promise<IOrder> {
    return this._orderService.place(body)
  }
}
