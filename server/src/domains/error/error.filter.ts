import { ArgumentsHost, Catch, ExceptionFilter, HttpException,
  Inject } from '@nestjs/common'
import { AppConfig } from '@qb/app-config'
import { HttpStatus } from '@qb/common/constants/http-status'
import { EmailService } from '../../domains/email/email.service'

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(EmailService) private _emailService: EmailService
  ) { }

  public catch(error: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse()
    const status = (error instanceof HttpException)
      ? error.getStatus()
      : HttpStatus.SERVER_ERROR_INTERNAL
    const statusKey = HttpStatus[status]

    if (!statusKey.match(/^CLIENT_ERROR_/)) {
      if (AppConfig.environment as string === 'production') {
        // async
        this._emailService.reportError(error)
      }
    }

    response
      .status(status)
      .json({
        ...error,
        message: error.message.toString(),
      })
  }
}
