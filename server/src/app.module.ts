import { Module } from '@nestjs/common'
import { applyDomino, AngularUniversalModule } from '@nestjs/ng-universal'
import { DB_CLIENT, DB_CONNECTION } from '@qb/common/api/interfaces/db-client'
import { connect } from 'mongoose'
import { join } from 'path'
import { DbClient } from './data-access/db-client'
import { DomainEventController } from './domain-event/domain-event.controller'

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
  ],
  providers: [
    { provide: DB_CLIENT, useClass: DbClient },
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
