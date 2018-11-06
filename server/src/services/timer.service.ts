import { inject, injectable } from 'inversify'
import * as rp from 'request-promise-native'

import { Timer } from '@mte/common/api/entities/timer'
import { ListFromQueryRequest } from '@mte/common/api/requests/list.request'
import { Types } from '@mte/common/constants/inversify/types'
import { DbClient } from '../data-access/db-client'
import { ErrorService } from './error.service'

@injectable()
export class TimerService {
    constructor(
        @inject(Types.ErrorService) private errorService: ErrorService,
        @inject(Types.DbClient) private dbClient: DbClient<Timer>
    ) {
        this.onInit()
    }

    public onInit() {
        this.restartAll()
    }

    public async restartAll() {
        let timers: Timer[]
        const requests = []
        let requestPromises: rp.RequestPromise[] = []

        // Find all existing Timers.

        try {
            timers = await this.dbClient.findQuery(Timer, new ListFromQueryRequest({ query: {}, limit: 0 }))
        }
        catch (error) {
            this.errorService.handleError(error)
        }

        // Delete all existing Timers.

        try {
            await this.dbClient.remove(Timer, {})
        }
        catch (error) {
            this.errorService.handleError(error)
        }

        // Create new API requests based on the old timers.

        timers.forEach((timer) => {
            const data = timer.jsonData ? JSON.parse(timer.jsonData) : null
            const timeout = timer.duration - (Date.now() - timer.startedAt)

            // If the timer is old, don't restore it.
            if (timeout < 0) return

            requests.push({
                method: timer.method,
                uri: timer.url,
                json: true,
                body: data,
            })
        })

        requestPromises = requests.map(request => rp(request))

        Promise.all(requestPromises)
            .catch((error) => {
                this.errorService.handleError(error)
            })
    }
}
