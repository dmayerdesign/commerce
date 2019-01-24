import { Controller, Inject } from '@nestjs/common'
import { Taxonomy } from '@qb/common/api/entities/taxonomy'
import { taxonomies } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { TaxonomyRepository } from './taxonomy.repository'

@Controller(taxonomies)
export class TaxonomyController extends QbController<Taxonomy> {
  constructor(
    @Inject(TaxonomyRepository)
    protected readonly _repository: TaxonomyRepository
  ) { super() }
}
