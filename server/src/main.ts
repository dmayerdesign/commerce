import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import * as helmet from 'helmet'
import 'reflect-metadata'
import { AppModule } from './app.module'

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')
  app.use(helmet())
  app.use(cookieParser())

  await app.listen(`${process.env.PORT || 8080}`)
  console.log(`Listening on port ${process.env.PORT || 8080}`)
}
main()
