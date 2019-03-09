import { Injectable } from '@nestjs/common'
import { User } from '@qb/common/domains/user/user'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(User))
  }
}
