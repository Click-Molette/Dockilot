import { Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { RpcException } from "@nestjs/microservices"
import { Interval } from "@nestjs/schedule"
import { InjectDockerode } from "@the-software-compagny/nestjs_module_dockerode"
import Dockerode from "dockerode"

export const STEAM_ALIVE_TIMEOUT = 10_000

@Injectable()
export class ContainersStreamService implements OnModuleInit {
  private readonly logger = new Logger(ContainersStreamService.name)

  private statsStreamMap = new Map<string, {
    expireIn: number,
    stream: NodeJS.ReadableStream,
  }>()

  public constructor(@InjectDockerode() private readonly dockerode: Dockerode) {
  }

  public async onModuleInit(): Promise<void> {
  }

  @Interval(STEAM_ALIVE_TIMEOUT)
  handleInterval() {
    for (const [id, statsStream] of this.statsStreamMap.entries()) {
      if (statsStream.expireIn < Date.now()) {
        console.log('Closing stream', id)
        if (typeof (statsStream.stream as any).destroy === 'function') {
          (statsStream.stream as any).destroy()
        }
        this.statsStreamMap.delete(id)
      }
    }
  }

  public async statsStream(id: string): Promise<NodeJS.ReadableStream> {
    this.logger.debug(['statsStream', JSON.stringify(Object.values(arguments))].join(' '))

    if (this.statsStreamMap.has(id)) {
      this.logger.debug('Stream already exists')

      return this.statsStreamMap.get(id).stream
    }

    const container = this.dockerode.getContainer(id)
    const stream = await container.stats({ stream: true })

    this.statsStreamMap.set(id, { expireIn: Date.now() + STEAM_ALIVE_TIMEOUT, stream })

    return stream
  }

  public async statsStreamAlive(id: string): Promise<void> {
    this.logger.debug(['statsStreamAlive', JSON.stringify(Object.values(arguments))].join(' '))

    const streamMap = this.statsStreamMap.get(id)

    if (!streamMap) {
      throw new RpcException(`statsStreamAlive - Stream <${id}> not found`)
    }

    this.statsStreamMap.set(id, { ...streamMap, expireIn: Date.now() + STEAM_ALIVE_TIMEOUT })
  }
}
