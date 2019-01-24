import { Injectable } from '@nestjs/common'
import { Wishlist } from '@qb/common/api/entities/wishlist'
import { Connection } from 'typeorm'
import { QbRepository } from '../../shared/data-access/repository'

@Injectable()
export class WishlistRepository extends QbRepository<Wishlist> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Wishlist))
  }
}
