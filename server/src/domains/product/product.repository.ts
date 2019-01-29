import { Injectable } from '@nestjs/common'
import { Product } from '@qb/common/domains/product/product'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class ProductRepository extends QbRepository<Product> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Product))
  }
}
