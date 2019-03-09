import { Controller as NestController, Inject } from '@nestjs/common'
import { attributes } from '@qb/common/constants/api-endpoints'
import { Attribute } from '@qb/common/domains/attribute/attribute'
import { Controller } from '../../shared/controller/controller'
import { AttributeRepository } from './attribute.repository'

@NestController(attributes)
export class AttributeController extends Controller<Attribute> {
  constructor(
    @Inject(AttributeRepository)
    protected readonly _repository: AttributeRepository
  ) { super() }
}
