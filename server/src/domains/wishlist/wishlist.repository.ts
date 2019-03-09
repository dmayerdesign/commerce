import { Injectable } from '@nestjs/common'
import { Wishlist } from '@qb/common/domains/wishlist/wishlist'
import { Connection } from 'typeorm'
import { Repository } from '../../shared/data-access/repository'

@Injectable()
export class WishlistRepository extends Repository<Wishlist> {
  constructor(
    protected readonly _connection: Connection
  ) {
    super(_connection.getMongoRepository(Wishlist))
  }
}
