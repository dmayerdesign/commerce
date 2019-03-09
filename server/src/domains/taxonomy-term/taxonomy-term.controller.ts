import { Controller as NestController, Inject } from '@nestjs/common'
import { TaxonomyTerm } from '@qb/common/domains/taxonomy-term/taxonomy-term'
import { taxonomyTerms } from '@qb/common/constants/api-endpoints'
import { Controller } from '../../shared/controller/controller'
import { TaxonomyTermRepository } from './taxonomy-term.repository'

@NestController(taxonomyTerms)
export class TaxonomyTermController extends Controller<TaxonomyTerm> {
  constructor(
    @Inject(TaxonomyTermRepository)
    protected readonly _repository: TaxonomyTermRepository
  ) { super() }
}
