
import { Injectable } from '@nestjs/common'
import { AppConfig } from '@qb/app-config'
import { ApiErrorResponse } from '@qb/common/api/responses/api-error.response'
import { InstagramPost } from '@qb/common/models/ui/instagram-post'
import * as rp from 'request-promise-native'

@Injectable()
export class InstagramService {
    public async getFeed(): Promise<InstagramPost[]> {
        const recentPostsEndpoint = `https://api.instagram.com/v1/users/${AppConfig.instagram_user_id}/media/recent`
        const requestOptions: rp.RequestPromiseOptions = {
            qs: {
                access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
            },
        }

        try {
            const responseStr: string = await rp(recentPostsEndpoint, requestOptions)
            const response: { pagination: object, data: InstagramPost[] } = responseStr ? JSON.parse(responseStr) : null
            if (response) {
                return response.data
            } else {
                return []
            }
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }
}
