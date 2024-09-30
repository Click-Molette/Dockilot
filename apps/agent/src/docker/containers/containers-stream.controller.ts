import { Controller, Logger } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { Observable, bufferTime, filter, finalize, fromEvent, map, merge, takeUntil, tap } from 'rxjs'
import { ContainersStreamService } from './containers-stream.service'

@Controller()
export class ContainersStreamController {
  private readonly logger = new Logger(ContainersStreamController.name)

  public constructor(private readonly service: ContainersStreamService) {
  }

  @MessagePattern('docker.containers.stats-stream')
  public async statsStream(@Payload() payload: { id: string }): Promise<Observable<unknown>> {
    const stream = await this.service.statsStream(payload.id)

    return fromEvent(stream, 'data').pipe(
      map((chunk) => chunk.toString()),
    )
  }

  @EventPattern('docker.containers.stats-stream-alive')
  public async statsStreamAlive(@Payload() payload: { id: string }): Promise<void> {
    await this.service.statsStreamAlive(payload.id)
  }

  @MessagePattern('docker.containers.exec-stream')
  public async attachStream(@Payload() payload: { clientId: string, containerId: string }): Promise<Observable<unknown>> {
    const stream = await this.service.execStream(payload.clientId, payload.containerId)

    const data$ = fromEvent(stream, 'data')
    const end$ = fromEvent(stream, 'end')
    const error$ = fromEvent(stream, 'error')

    const interval = setInterval(() => {
      this.service.execStreamAlive(payload.clientId, payload.containerId)
    }, 1_000)

    return data$.pipe(
      map((chunk) => chunk.toString()),
      bufferTime(100),
      filter((chunks) => chunks.length > 0),
      takeUntil(end$),
      takeUntil(error$),
      finalize(() => {
        this.logger.debug('Closing stream')
        clearInterval(interval)
        // stream?.end()
      }),
    )
  }

  @EventPattern('docker.containers.exec-stream-alive')
  public async execStreamAlive(@Payload() payload: { clientId: string, containerId: string }): Promise<void> {
    await this.service.execStreamAlive(payload.clientId, payload.containerId)
  }

  @EventPattern('docker.containers.exec-stream-finalize')
  public async execStreamFinalize(@Payload() payload: { clientId: string, containerId: string }): Promise<void> {
    await this.service.execStreamFinalize(payload.clientId, payload.containerId)
  }

  @EventPattern('docker.containers.exec-stream-cmd')
  public async execStreamCmd(@Payload() payload: { clientId: string, containerId: string, cmd: string }): Promise<void> {
    await this.service.execStreamCmd(payload.clientId, payload.containerId, payload.cmd)
  }

  @MessagePattern('docker.containers.global-state-stream')
  public async globalStateStream(): Promise<Observable<unknown>> {
    const stream = await this.service.globalStateStream()

    return fromEvent(stream, 'data').pipe(
      map((chunk) => chunk.toString()),
    )
  }
}
