import { Injectable } from '@nestjs/common'
import { TaxonomyTerm } from '@qb/common/domains/taxonomy-term/taxonomy-term'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class TaxonomyTermRepository extends Repository<TaxonomyTerm> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(TaxonomyTerm))
  }
}
