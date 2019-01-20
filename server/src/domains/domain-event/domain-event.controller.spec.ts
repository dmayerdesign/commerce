import { Test, TestingModule } from '@nestjs/testing'
import { DomainEventController } from './domain-event.controller.generated'

describe('Domain Event Controller', () => {
  let module: TestingModule
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [DomainEventController],
    }).compile()
  })
  it('should be defined', () => {
    const controller: DomainEventController = module.get<DomainEventController>(DomainEventController)
    expect(controller).toBeDefined()
  })
})
