import { Injectable } from '@nestjs/common'
import { Order } from '@qb/common/domains/order/order'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Order))
  }
}
