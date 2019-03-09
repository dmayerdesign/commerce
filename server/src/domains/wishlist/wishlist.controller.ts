import { Controller as NestController, Inject } from '@nestjs/common'
import { Wishlist } from '@qb/common/domains/wishlist/wishlist'
import { wishlists } from '@qb/common/constants/api-endpoints'
import { Controller } from '../../shared/controller/controller'
import { WishlistRepository } from './wishlist.repository'

@NestController(wishlists)
export class WishlistController extends Controller<Wishlist> {
  constructor(
    @Inject(WishlistRepository)
    protected readonly _repository: WishlistRepository
  ) { super() }
}
