import { Injectable } from '@nestjs/common'
import { Taxonomy } from '@qb/common/domains/taxonomy/taxonomy'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class TaxonomyRepository extends Repository<Taxonomy> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Taxonomy))
  }
}
