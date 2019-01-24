import { Injectable } from '@nestjs/common'
import { Cart } from '@qb/common/api/entities/cart'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class CartRepository extends QbRepository<Cart> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Cart))
  }
}
