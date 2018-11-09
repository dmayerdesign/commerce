import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DomainEvent } from '@qb/common/api/entities/domain-event'
import { DOMAIN_EVENT } from '@qb/common/config/mongoose-module-config.generated'
import { MongooseModel } from '@qb/common/goosetype'

@Injectable()
export class ExampleApiReducer {
  constructor(@InjectModel(DOMAIN_EVENT) private readonly catModel: MongooseModel<DomainEvent>) {}
}
