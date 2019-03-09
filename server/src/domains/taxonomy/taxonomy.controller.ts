import { Controller as NestController, Inject } from '@nestjs/common'
import { Taxonomy } from '@qb/common/domains/taxonomy/taxonomy'
import { taxonomies } from '@qb/common/constants/api-endpoints'
import { Controller } from '../../shared/controller/controller'
import { TaxonomyRepository } from './taxonomy.repository'

@NestController(taxonomies)
export class TaxonomyController extends Controller<Taxonomy> {
  constructor(
    @Inject(TaxonomyRepository)
    protected readonly _repository: TaxonomyRepository
  ) { super() }
}
