import { Injectable } from '@nestjs/common'
import { Product } from '@qb/common/domains/product/product'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Product))
  }
}
