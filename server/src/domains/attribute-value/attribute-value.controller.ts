import { Controller as NestController, Inject } from '@nestjs/common'
import { attributeValues } from '@qb/common/constants/api-endpoints'
import { AttributeValue } from '@qb/common/domains/attribute-value/attribute-value'
import { Controller } from '../../shared/controller/controller'
import { AttributeValueRepository } from './attribute-value.repository'

@NestController(attributeValues)
export class AttributeValueController extends Controller<AttributeValue> {
  constructor(
    @Inject(AttributeValueRepository)
    protected readonly _repository: AttributeValueRepository
  ) { super() }
}
