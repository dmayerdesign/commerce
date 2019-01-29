import { Injectable } from '@nestjs/common'
import { DomainEvent } from '@qb/common/domains/domain-event/domain-event'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class DomainEventRepository extends QbRepository<DomainEvent> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(DomainEvent))
  }
}
