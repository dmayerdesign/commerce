import { Controller, Inject } from '@nestjs/common'
import { DomainEvent } from '@qb/common/api/entities/domain-event'
import { DomainEvent as IDomainEvent } from '@qb/common/api/interfaces/domain-event'
import { QbRepository } from 'server/src/shared/data-access/repository'
import { QbController } from '../../shared/controller/controller'

@Controller('api/domain-events')
export class DomainEventController extends QbController<IDomainEvent> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<IDomainEvent>
  ) {
    super()
    this._repository.configureForGoosetypeEntity(DomainEvent)
  }
}
