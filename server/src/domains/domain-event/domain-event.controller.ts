import { Controller, Inject } from '@nestjs/common'
import { domainEvents } from '@qb/common/constants/api-endpoints'
import { DomainEvent } from '@qb/common/domains/domain-event/domain-event'
import { QbController } from '../../shared/controller/controller'
import { DomainEventRepository } from './domain-event.repository'

@Controller(domainEvents)
export class DomainEventController extends QbController<DomainEvent> {
  constructor(
    @Inject(DomainEventRepository)
    protected readonly _repository: DomainEventRepository
  ) { super() }
}
