import { NestFactory } from '@nestjs/core'
// import * as helmet from 'helmet'
import { AppModule } from './app.module'

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  // TODO: Use `setGlobalPrefix`.
  // app.setGlobalPrefix('/api')
  // TODO: Install helmet.
  // app.use(helmet())

  await app.listen(4300)
}
main()
