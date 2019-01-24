import { Injectable } from '@nestjs/common'
import { Discount } from '@qb/common/api/entities/discount'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class DiscountRepository extends QbRepository<Discount> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Discount))
  }
}
