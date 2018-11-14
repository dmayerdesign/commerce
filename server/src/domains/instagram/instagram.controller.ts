
import { Controller, Get, Inject, Injectable, Response } from '@nestjs/common'
import { ApiEndpoints } from '@qb/common/constants/api-endpoints'
import { InstagramPost } from '@qb/common/models/ui/instagram-post'
import { QbRepository } from 'server/src/shared/data-access/repository'
import { QbReadOnlyController } from '../../shared/controller/controller'
import { InstagramService } from './instagram.service'

@Injectable()
@Controller(ApiEndpoints.Instagram)
export class InstagramController extends QbReadOnlyController<InstagramPost> {
    constructor(
        @Inject(QbRepository) protected _repository: InstagramService
    ) { super() }
}
