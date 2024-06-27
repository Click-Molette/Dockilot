import { Controller } from "@nestjs/common"
import { Ctx, EventPattern, MessagePattern, Payload, TcpContext } from "@nestjs/microservices"
import { Observable, fromEvent, map } from "rxjs"
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
}
