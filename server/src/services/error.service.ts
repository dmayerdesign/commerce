import { inject, injectable } from 'inversify'

import { Types } from '@mte/common/constants/inversify/types'
import { EmailService } from './email.service'

@injectable()
export class ErrorService {
    @inject(Types.EmailService) private emailService: EmailService

    public handleError(error: Error) {
        console.error(error)
        this.emailService.reportError(error)
    }
}
