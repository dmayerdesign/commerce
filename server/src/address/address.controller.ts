import { Controller, Get } from '@nestjs/common'
import { Address } from '@qb/common/api/entities/address'

@Controller('api/address')
export class AddressController {
  @Get('/')
  public list(): Address {
    return 
  }
}
