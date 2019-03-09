import { Injectable } from '@nestjs/common'
import { Discount } from '@qb/common/domains/discount/discount'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class DiscountRepository extends Repository<Discount> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Discount))
  }
}
