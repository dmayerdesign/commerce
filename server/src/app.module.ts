import { Module } from '@nestjs/common'
import { applyDomino, AngularUniversalModule } from '@nestjs/ng-universal'
import { DB_CONNECTION } from '@qb/common/api/interfaces/repository'
import { connect } from 'mongoose'
import { join } from 'path'
import { DomainEventController } from './domains/domain-event/domain-event.controller'
import { OrganizationController } from './domains/organization/organization.controller'
import { OrganizationService } from './domains/organization/organization.service'
import { ProductController } from './domains/product/product.controller'
import { ProductService } from './domains/product/product.service'
import { QbRepository } from './shared/data-access/repository'

const BROWSER_DIR = join(process.cwd(), 'dist/web')
applyDomino(global, join(BROWSER_DIR, 'index.html'))

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      viewsPath: BROWSER_DIR,
      bundle: require('../../dist/web-ssr/main.js'),
    }),
  ],
  controllers: [
    DomainEventController,
    OrganizationController,
    ProductController,
  ],
  providers: [
    QbRepository,
    OrganizationService,
    ProductService,
    {
      provide: DB_CONNECTION,
      useFactory: () => {
        return new Promise((resolve, reject) => {
          const connection = connect(process.env.MONGODB_URI_TEST, (err) => {
            console.log('connected?', err)
            if (err) reject(err)
            else resolve(connection)
          })
        })
      },
    },
  ],
})
export class AppModule {}
