import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';

describe('Address Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AddressController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AddressController = module.get<AddressController>(AddressController);
    expect(controller).toBeDefined();
  });
});
