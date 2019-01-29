import { Injectable } from '@nestjs/common'
import { Attribute } from '@qb/common/domains/attribute/attribute'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class AttributeRepository extends QbRepository<Attribute> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Attribute))
  }
}
