import { Module } from '@nestjs/common'
import { applyDomino, AngularUniversalModule } from '@nestjs/ng-universal'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppConfig } from '@qb/app-config'
import { join, resolve } from 'path'
import { domainModules } from './domain-modules'
import { AdminController } from './domains/admin/admin.controller'
import { HyzershopMigrationService } from './domains/hyzershop-migration/hyzershop-migration.service'
import { InstagramRepository } from './domains/instagram/instagram.repository'
import { OrganizationService } from './domains/organization/organization.service'
import { ProductService } from './domains/product/product.service'

const BROWSER_DIR = join(process.cwd(), 'dist/web')
applyDomino(global, join(BROWSER_DIR, 'index.html'))

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URI_TEST,
      authSource: 'admin',
      replicaSet: AppConfig.replica_set_name,
      useNewUrlParser: true,
      ssl: true,
      entities: [
        resolve(__dirname, AppConfig.path_to_entities_from_module_root),
      ],
    }),
    AngularUniversalModule.forRoot({
      viewsPath: BROWSER_DIR,
      bundle: require(AppConfig.path_to_web_ssr_from_module_root + '/main.js'),
    }),
    ...domainModules,
  ],
  controllers: [
    AdminController,
  ],
  providers: [
    OrganizationService,
    InstagramRepository,
    ProductService,
    HyzershopMigrationService
  ],
})
export class AppModule { }
