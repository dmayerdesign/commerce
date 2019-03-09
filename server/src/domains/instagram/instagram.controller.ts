
import { Controller as NestController, Inject } from '@nestjs/common'
import { instagramPosts } from '@qb/common/constants/api-endpoints'
import { InstagramPost } from '@qb/common/models/ui/instagram-post'
import { ReadOnlyController } from '../../shared/controller/controller'
import { InstagramRepository } from './instagram.repository'

@NestController(instagramPosts)
export class InstagramController extends ReadOnlyController<InstagramPost> {
    constructor(
        @Inject(InstagramRepository) protected _repository: InstagramRepository
    ) { super() }
}
