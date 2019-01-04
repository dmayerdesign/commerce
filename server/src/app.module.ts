import { Module } from '@nestjs/common'
import { applyDomino, AngularUniversalModule } from '@nestjs/ng-universal'
import { AppConfig } from '@qb/app-config'
import { join, resolve } from 'path'
import { createConnection, ConnectionOptions } from 'typeorm'
import { AdminController } from './domains/admin/admin.controller'
import { DiscountController } from './domains/discount/discount.controller'
import { DomainEventController } from './domains/domain-event/domain-event.controller'
import { HyzershopMigrationService } from './domains/hyzershop-migration/hyzershop-migration.service'
import { InstagramRepository } from './domains/instagram/instagram.repository'
import { OrganizationController } from './domains/organization/organization.controller'
import { OrganizationService } from './domains/organization/organization.service'
import { ProductController } from './domains/product/product.controller'
import { ProductService } from './domains/product/product.service'
import { QbRepository } from './shared/data-access/repository'

const BROWSER_DIR = join(process.cwd(), 'dist/web')
const DB_CONNECTION = 'DB_CONNECTION'
applyDomino(global, join(BROWSER_DIR, 'index.html'))

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      viewsPath: BROWSER_DIR,
      bundle: require(AppConfig.path_to_web_ssr_from_module_root + '/main.js'),
    }),
  ],
  controllers: [
    AdminController,
    DiscountController,
    DomainEventController,
    OrganizationController,
    ProductController,
  ],
  providers: [
    {
      provide: DB_CONNECTION,
      useFactory: async () => createConnection({
        type: 'mongodb',
        url: process.env.MONGODB_URI_TEST,
        entities: [
          resolve(__dirname, AppConfig.path_to_entities_from_module_root)
        ]
      } as ConnectionOptions)
    },
    QbRepository,
    OrganizationService,
    ProductService,
    InstagramRepository,
    HyzershopMigrationService
  ],
})
export class AppModule {}
