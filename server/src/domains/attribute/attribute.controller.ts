import { Controller, Inject } from '@nestjs/common'
import { Attribute } from '@qb/common/api/entities/attribute'
import { attributes } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { AttributeRepository } from './attribute.repository'

@Controller(attributes)
export class AttributeController extends QbController<Attribute> {
  constructor(
    @Inject(AttributeRepository)
    protected readonly _repository: AttributeRepository
  ) { super() }
}
