import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Observable, tap, timeout } from 'rxjs'
import { observableTimeoutCatch } from '~/_common/_functions/observable-timeout-catch.function'

@Injectable()
export class ContainersStreamService implements OnModuleInit {
  protected readonly logger = new Logger(ContainersStreamService.name)

  public constructor(@Inject('docker') private readonly _client: ClientProxy) {
  }

  public async onModuleInit() {
    try {
      const res = await this._client.connect()
    } catch (err) {
      console.error('err', err)
    }
  }

  public statsStream(id: string): Observable<NodeJS.ReadableStream> {
    const statsStream$ = this._client.send<any>('docker.containers.stats-stream', { id })

    return statsStream$.pipe(
      timeout(10_000),
      tap((chunk) => this.logger.verbose('Received chunk:', chunk.toString())),
    )
  }

  public statsStreamAlive(id: string): Observable<any> {
    return this._client.emit<any>('docker.containers.stats-stream-alive', { id })
  }

  public execStream(clientId: string, containerId: string): Observable<string[]> {
    const execStream$ = this._client.send<any>('docker.containers.exec-stream', { clientId, containerId })

    return execStream$
      .pipe(
        tap((chunk) => JSON.stringify(chunk.toString())),
      )
  }

  public execStreamFinalize(clientId: string, containerId: string): Observable<any> {
    return this._client.emit<any>('docker.containers.exec-stream-finalize', { clientId, containerId })
  }

  public execStreamAlive(clientId: string, containerId: string): Observable<any> {
    return this._client.emit<any>('docker.containers.exec-stream-alive', { clientId, containerId })
  }

  public execStreamCmd(clientId: string, containerId: string, cmd: string): Observable<any> {
    return this._client.emit<any>('docker.containers.exec-stream-cmd', { clientId, containerId, cmd })
  }

  public globalStateStream(): Observable<any> {
    const globalStateStream$ = this._client.send<any>('docker.containers.global-state-stream', {})

    return globalStateStream$.pipe(
      tap((chunk) => this.logger.verbose('Received chunk:', chunk.toString())),
    )
  }
}
