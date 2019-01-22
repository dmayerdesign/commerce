import { Controller, Inject, Post } from '@nestjs/common'
import { Product } from '@qb/common/api/interfaces/product'
import { admin } from '@qb/common/constants/api-endpoints'
import { HyzershopMigrationService } from '../hyzershop-migration/hyzershop-migration.service'

@Controller(admin)
// @UseGuards(AdminGuard)
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
