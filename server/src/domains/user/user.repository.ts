import { Injectable } from '@nestjs/common'
import { User } from '@qb/common/api/entities/user'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class UserRepository extends QbRepository<User> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(User))
  }
}
