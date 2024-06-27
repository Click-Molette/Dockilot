import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'

const GENERIC_ERROR_MESSAGE = 'Unexpected error occurred'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const statusCode = exception?.statusCode || exception?.error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR

    this.logger.error(`Error when processing [${response.req.method}] ${response.req.url}:\n - [${statusCode}] ${exception?.message}`)

    response.status(statusCode).json({
      statusCode,
      message: exception?.message || GENERIC_ERROR_MESSAGE,
    })
  }
}
