
import { Response } from 'express'
import { inject, injectable } from 'inversify'
import { controller, httpGet, interfaces, response } from 'inversify-express-utils'

import { ApiEndpoints } from '@mte/common/constants'
import { Types } from '@mte/common/constants/inversify/types'
import { InstagramPost } from '@mte/common/models/ui/instagram-post'
import { InstagramService } from '../services/instagram.service'
import { ApiController } from './api.controller'

@injectable()
@controller(ApiEndpoints.Instagram)
export class InstagramController extends ApiController<InstagramPost[]> implements interfaces.Controller {
    constructor(
        @inject(Types.InstagramService) private instagramService: InstagramService
    ) { super() }

    @httpGet('/')
    public get(
        @response() res: Response
    ): void {
        this.handleApiResponse(this.instagramService.getFeed(), res)
    }
}
