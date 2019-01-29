import { Injectable } from '@nestjs/common'
import { AttributeValue } from '@qb/common/domains/attribute-value/attribute-value'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class AttributeValueRepository extends QbRepository<AttributeValue> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(AttributeValue))
  }
}
