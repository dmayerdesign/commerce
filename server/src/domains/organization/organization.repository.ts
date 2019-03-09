import { Injectable } from '@nestjs/common'
import { Organization } from '@qb/common/domains/organization/organization'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Organization))
  }
}
