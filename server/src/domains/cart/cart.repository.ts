import { Injectable } from '@nestjs/common'
import { Cart } from '@qb/common/domains/cart/cart'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class CartRepository extends Repository<Cart> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Cart))
  }
}
