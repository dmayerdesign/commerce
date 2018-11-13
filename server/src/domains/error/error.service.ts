import { inject, injectable } from 'inversify'

import { Types } from '@qb/common/constants/inversify/types'
import { EmailService } from '../../domains/email/email.service'

@injectable()
export class ErrorService {
    @inject(Types.EmailService) private emailService: EmailService

    public handleError(error: Error) {
        console.error(error)
        this.emailService.reportError(error)
    }
}
