import { Injectable } from '@nestjs/common'
import { Attribute } from '@qb/common/domains/attribute/attribute'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class AttributeRepository extends Repository<Attribute> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Attribute))
  }
}
