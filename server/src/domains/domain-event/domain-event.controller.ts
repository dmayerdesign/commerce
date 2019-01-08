import { Controller, Inject } from '@nestjs/common'
import { DomainEvent } from '@qb/common/api/entities/domain-event'
import { DomainEvent as IDomainEvent } from '@qb/common/api/interfaces/domain-event'
import { domainEvents } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'

@Controller(domainEvents)
export class DomainEventController extends QbController<IDomainEvent> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<IDomainEvent>
  ) {
    super()
    this._repository.configureForTypeOrmEntity(DomainEvent)
  }
}
