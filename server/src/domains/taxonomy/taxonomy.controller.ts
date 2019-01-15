import { Controller, Inject } from '@nestjs/common'
import { Taxonomy } from '@qb/common/api/entities/taxonomy'
import { taxonomies } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'

@Controller(taxonomies)
export class TaxonomyController extends QbController<Taxonomy> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<Taxonomy>
  ) {
    super()
    this._repository.configureForTypeOrmEntity(Taxonomy)
  }
}
