import { Controller, Inject } from '@nestjs/common'
import { TaxonomyTerm } from '@qb/common/domains/taxonomy-term/taxonomy-term'
import { taxonomyTerms } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { TaxonomyTermRepository } from './taxonomy-term.repository'

@Controller(taxonomyTerms)
export class TaxonomyTermController extends QbController<TaxonomyTerm> {
  constructor(
    @Inject(TaxonomyTermRepository)
    protected readonly _repository: TaxonomyTermRepository
  ) { super() }
}
