import { Controller, Inject } from '@nestjs/common'
import { Wishlist } from '@qb/common/api/entities/wishlist'
import { wishlists } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'

@Controller(wishlists)
export class WishlistController extends QbController<Wishlist> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<Wishlist>
  ) {
    super()
    this._repository.configureForTypeOrmEntity(Wishlist)
  }
}
