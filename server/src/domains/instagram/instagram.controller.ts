
import { Controller, Inject } from '@nestjs/common'
import { instagramPosts } from '@qb/common/constants/api-endpoints'
import { InstagramPost } from '@qb/common/models/ui/instagram-post'
import { QbReadOnlyController } from '../../shared/controller/controller'
import { InstagramRepository } from './instagram.repository'

@Controller(instagramPosts)
export class InstagramController extends QbReadOnlyController<InstagramPost> {
    constructor(
        @Inject(InstagramRepository) protected _repository: InstagramRepository
    ) { super() }
}
