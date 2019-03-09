import { Controller as NestController, Inject } from '@nestjs/common'
import { domainEvents } from '@qb/common/constants/api-endpoints'
import { DomainEvent } from '@qb/common/domains/domain-event/domain-event'
import { Controller } from '../../shared/controller/controller'
import { DomainEventRepository } from './domain-event.repository'

@NestController(domainEvents)
export class DomainEventController extends Controller<DomainEvent> {
  constructor(
    @Inject(DomainEventRepository)
    protected readonly _repository: DomainEventRepository
  ) { super() }
}
