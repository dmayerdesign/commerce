import { Controller, Get } from '@nestjs/common'
import { AppConfig } from '@qb/common/config/app.config'

@Controller('api')
export class ExampleController {
  @Get('/')
  public root(): object {
    return {
      helloWorld: true,
      foo: false,
      appConfig: { ...AppConfig }
    }
  }
}