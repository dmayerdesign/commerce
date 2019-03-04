import { Controller, Inject, Post } from '@nestjs/common'
import { admin } from '@qb/common/constants/api-endpoints'
import { UserRole } from '@qb/common/constants/enums/user-role'
import { Product } from '@qb/common/domains/product/product.interface'
import { SeedService } from '../../shared/data-access/seed.service'
import { UserGuarded } from '../user/user.decorators'

@Controller(admin)
@UserGuarded(UserRole.Administrator)
export class AdminController {

  constructor(
    @Inject(SeedService)
    private _seedService: SeedService
  ) { }

  @Post('migrate')
  public migrateProducts(): Promise<Product[]> {
    return this._seedService.seed()
  }
}
