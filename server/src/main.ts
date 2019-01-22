import { NestFactory } from '@nestjs/core'
import * as helmet from 'helmet'
import 'reflect-metadata'
import { AppModule } from './app.module'

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')
  app.use(helmet())

  await app.listen(process.env.PORT as string)
  console.log(`Listening on port ${process.env.PORT}`)
}
main()
