import { Controller, Inject } from '@nestjs/common'
import { Wishlist } from '@qb/common/domains/wishlist/wishlist'
import { wishlists } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { WishlistRepository } from './wishlist.repository'

@Controller(wishlists)
export class WishlistController extends QbController<Wishlist> {
  constructor(
    @Inject(WishlistRepository)
    protected readonly _repository: WishlistRepository
  ) { super() }
}
