
import { injectable } from 'inversify'
import * as rp from 'request-promise-native'

import { AppConfig } from '@mte/app-config'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { ApiResponse } from '@mte/common/api/responses/api.response'
import { InstagramPost } from '@mte/common/models/ui/instagram-post'

@injectable()
export class InstagramService {
    public getFeed(): Promise<ApiResponse<InstagramPost[]>> {
        return new Promise<ApiResponse<InstagramPost[]>>(async (resolve, reject) => {
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
                    resolve(new ApiResponse(response.data))
                } else {
                    resolve(new ApiResponse([]))
                }
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }
}
