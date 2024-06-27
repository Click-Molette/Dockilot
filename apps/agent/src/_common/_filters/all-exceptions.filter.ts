import { ArgumentsHost, Catch, HttpStatus, Logger, RpcExceptionFilter } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { RpcException } from '@nestjs/microservices'

const GENERIC_ERROR_MESSAGE = 'Unexpected error occurred'

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  public catch(exception: any, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc()
    const data = ctx.getData()
    const statusCode = exception?.statusCode || exception?.error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR

    this.logger.error(`Error when processing <${JSON.stringify(data)}>:\n - [${statusCode}] ${exception?.message}`)

    return throwError(() => new RpcException({
      statusCode,
      message: exception.message || GENERIC_ERROR_MESSAGE,
    }))
  }
}
