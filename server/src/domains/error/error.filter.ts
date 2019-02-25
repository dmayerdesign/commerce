import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { HttpStatus } from '@qb/common/constants/http-status'

@Catch()
export class ErrorFilter implements ExceptionFilter {

  public catch(error: Error, host: ArgumentsHost): void {
console.log('[ErrorFilter]', error)

    const response = host.switchToHttp().getResponse()
    const status = (error instanceof HttpException)
      ? error.getStatus()
      : HttpStatus.SERVER_ERROR_INTERNAL

    response
      .status(status)
      .json({
        ...error,
        message: error.message.toString(),
      })
  }
}
