import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { Observable, tap, timeout } from "rxjs"

@Injectable()
export class ContainersStreamService implements OnModuleInit {
  private readonly logger = new Logger(ContainersStreamService.name)

  public constructor(@Inject('docker') private readonly client: ClientProxy) {
  }

  public async onModuleInit() {
    try {
      const res = await this.client.connect()
    } catch (err) {
      console.error('err', err)
    }
  }

  public statsStream(id: string): Observable<NodeJS.ReadableStream> {
    const statsStream$ = this.client.send<any>('docker.containers.stats-stream', { id })

    return statsStream$.pipe(
      timeout(10_000),
      tap((chunk) => this.logger.verbose('Received chunk:', chunk.toString())),
    )
  }

  public statsStreamAlive(id: string): Observable<any> {
    return this.client.emit<any>('docker.containers.stats-stream-alive', { id })
  }

  public execStream(id: string): Observable<NodeJS.ReadWriteStream> {
    const execStream$ = this.client.send<any>('docker.containers.exec-stream', { id })

    return execStream$.pipe(
      // timeout(10_000),
      tap((chunk) => this.logger.verbose('Received chunk:', chunk.toString())),
    )
  }

  public execStreamAlive(id: string): Observable<any> {
    return this.client.emit<any>('docker.containers.exec-stream-alive', { id })
  }

  public execStreamCmd(id: string, cmd: string): Observable<any> {
    return this.client.emit<any>('docker.containers.exec-stream-cmd', { id, cmd })
  }
}
