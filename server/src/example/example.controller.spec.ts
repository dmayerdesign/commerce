import { Test, TestingModule } from '@nestjs/testing'
import { ExampleController } from './example.controller'

describe('Example Controller', () => {
  let module: TestingModule
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ExampleController],
    }).compile()
  })
  it('should be defined', () => {
    const controller: ExampleController = module.get<ExampleController>(ExampleController)
    expect(controller).toBeDefined()
  })
})
