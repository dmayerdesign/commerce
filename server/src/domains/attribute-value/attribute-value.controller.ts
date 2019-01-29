import { Controller, Inject } from '@nestjs/common'
import { AttributeValue } from '@qb/common/domains/attribute-value/attribute-value'
import { attributeValues } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { AttributeValueRepository } from './attribute-value.repository'

@Controller(attributeValues)
export class AttributeValueController extends QbController<AttributeValue> {
  constructor(
    @Inject(AttributeValueRepository)
    protected readonly _repository: AttributeValueRepository
  ) { super() }
}
