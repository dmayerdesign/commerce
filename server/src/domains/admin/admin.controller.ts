import { Controller, Inject, Post } from '@nestjs/common'
import { Product } from '@qb/common/api/interfaces/product'
import { admin } from '@qb/common/constants/api-endpoints'
import { UserRole } from '@qb/common/constants/enums/user-role'
import { HyzershopMigrationService } from '../hyzershop-migration/hyzershop-migration.service'
import { Authenticated } from '../user/user.decorators'

@Controller(admin)
@Authenticated(UserRole.Administrator)
export class AdminController {

  constructor(
    @Inject(HyzershopMigrationService)
    private _hyzerShopMigrationService: HyzershopMigrationService
  ) { }

  @Post('migrate')
  public migrateProducts(): Promise<Product[]> {
    return this._hyzerShopMigrationService.createProductsFromExportedJSON()
  }
}
