import { Controller, Inject } from '@nestjs/common'
import { TaxonomyTerm } from '@qb/common/api/entities/taxonomy-term'
import { taxonomyTerms } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'

@Controller(taxonomyTerms)
export class TaxonomyTermController extends QbController<TaxonomyTerm> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<TaxonomyTerm>
  ) {
    super()
    this._repository.configureForTypeOrmEntity(TaxonomyTerm)
  }
}
