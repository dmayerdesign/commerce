import { Inject, Injectable } from '@nestjs/common'
import { EmailService } from '../../domains/email/email.service'

@Injectable()
export class ErrorService {
    @Inject(EmailService) private emailService: EmailService

    public handleError(error: Error) {
        console.error(error)
        this.emailService.reportError(error)
    }
}
