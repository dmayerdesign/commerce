import { Body, Controller, Inject, Post } from '@nestjs/common'
import { Order } from '@qb/common/domains/order/order'
import { orders } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { OrderRepository } from './order.repository'
import { OrderService } from './order.service'

@Controller(orders)
export class OrderController extends QbController<Order> {
  constructor(
    @Inject(OrderRepository) protected readonly _repository: OrderRepository,
    @Inject(OrderService) protected readonly _orderService: OrderService,
  ) { super() }

  @Post()
  public createOne(
    @Body() body: Partial<Order>,
  ): Promise<Order> {
    return this._orderService.place(body)
  }
}
