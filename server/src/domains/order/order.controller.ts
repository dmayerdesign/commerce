import { Body, Controller, Inject, Post } from '@nestjs/common'
import { Order } from '@qb/common/api/entities/order'
import { orders } from '@qb/common/constants/api-endpoints'
import { OrderController as OrderControllerGenerated } from './order.controller.generated'
import { OrderRepository } from './order.repository.generated'
import { OrderService } from './order.service'

@Controller(orders)
export class OrderController extends OrderControllerGenerated {
  constructor(
    @Inject(OrderRepository) protected readonly _repository: OrderRepository,
    @Inject(OrderService) protected readonly _orderService: OrderService,
  ) { super(_repository) }

  @Post()
  public createOne(
    @Body() body: Partial<Order>,
  ): Promise<Order> {
    return this._orderService.place(body)
  }
}
