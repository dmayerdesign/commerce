require('dotenv').config()
import { NestFactory } from '@nestjs/core'
import { environment } from '@qb/environment-vars'
import * as cookieParser from 'cookie-parser'
import * as helmet from 'helmet'
import 'reflect-metadata'
import { AppModule } from './app.module'
import { EmailService } from './domains/email/email.service'
import { ErrorFilter } from './domains/error/error.filter'

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  console.log(`nest app created!`)

  app.setGlobalPrefix('/api')
  app.use(helmet())
  app.use(cookieParser())
  app.useGlobalFilters(
    new ErrorFilter(new EmailService())
  )

  await app.listen(environment().PORT as string)
  console.log(`Listening on port ${environment().PORT}`)
}
main()
