import { Test, TestingModule } from '@nestjs/testing'
import { AddressService } from './address.service'

describe('AddressService', () => {
  let service: AddressService
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressService],
    }).compile()
    service = module.get<AddressService>(AddressService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
