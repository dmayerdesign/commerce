import { Injectable } from '@nestjs/common'
import { Taxonomy } from '@qb/common/api/entities/taxonomy'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class TaxonomyRepository extends QbRepository<Taxonomy> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Taxonomy))
  }
}
