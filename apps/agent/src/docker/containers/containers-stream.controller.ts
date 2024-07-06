import { Controller } from "@nestjs/common"
import { Ctx, EventPattern, MessagePattern, Payload, TcpContext } from "@nestjs/microservices"
import { Observable, fromEvent, map, takeUntil } from "rxjs"
import { ContainersStreamService } from "./containers-stream.service"

@Controller()
export class ContainersStreamController {

  public constructor(private readonly service: ContainersStreamService) {
  }

  @MessagePattern('docker.containers.stats-stream')
  public async statsStream(@Payload() payload: { id: string }): Promise<Observable<unknown>> {
    const stream = await this.service.statsStream(payload.id)

    return fromEvent(stream, 'data').pipe(
      map((chunk) => JSON.stringify(chunk.toString())),
    )
  }

  @EventPattern('docker.containers.stats-stream-alive')
  public async statsStreamAlive(@Payload() payload: { id: string }): Promise<void> {
    await this.service.statsStreamAlive(payload.id)
  }

  @MessagePattern('docker.containers.exec-stream')
  public async attachStream(@Payload() payload: { id: string }): Promise<Observable<unknown>> {
    const stream = await this.service.execStream(payload.id)

    const data$ = fromEvent(stream, 'data')
    const end$ = fromEvent(stream, 'end')
    const error$ = fromEvent(stream, 'error')

    return data$.pipe(
      map((chunk) => chunk.toString()),
      takeUntil(end$),
      takeUntil(error$),
    )
  }

  @EventPattern('docker.containers.exec-stream-alive')
  public async execStreamAlive(@Payload() payload: { id: string }): Promise<void> {
    await this.service.execStreamAlive(payload.id)
  }

  @EventPattern('docker.containers.exec-stream-cmd')
  public async execStreamCmd(@Payload() payload: { id: string, cmd: string }): Promise<void> {
    await this.service.execStreamCmd(payload.id, payload.cmd)
  }
}
