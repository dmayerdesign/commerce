import { Injectable } from '@nestjs/common'
import { Organization } from '@qb/common/api/entities/organization'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class OrganizationRepository extends QbRepository<Organization> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Organization))
  }
}
