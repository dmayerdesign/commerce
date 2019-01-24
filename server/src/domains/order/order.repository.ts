import { Injectable } from '@nestjs/common'
import { Order } from '@qb/common/api/entities/order'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class OrderRepository extends QbRepository<Order> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Order))
  }
}
