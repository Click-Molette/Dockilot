import { Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Observable } from 'rxjs'

@Injectable()
export class MicroserviceClientManagerService {
  private readonly logger = new Logger(MicroserviceClientManagerService.name)

  private clients: Map<string, ClientProxy> = new Map()

  public sendTaskToAllMicroservices<TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult>[] {
    const observables: Observable<TResult>[] = []

    for (const [name, client] of this.clients) {
      this.logger.log(`Sending task to microservice: ${name}`)
      observables.push(client.emit<TResult, TInput>(pattern, data))
    }

    return observables
  }
}
