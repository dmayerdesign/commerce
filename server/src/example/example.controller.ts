import { Controller, Get } from '@nestjs/common'

@Controller('api')
export class ExampleController {
  @Get('/')
  public root(): object {
    return {
      helloWorld: true
    }
  }
}
