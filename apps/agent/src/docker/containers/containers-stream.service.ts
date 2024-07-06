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

  private execStreamMap = new Map<string, {
    expireIn: number,
    stream: NodeJS.ReadWriteStream,
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

    // for (const [id, execStream] of this.execStreamMap.entries()) {
    //   if (execStream.expireIn < Date.now()) {
    //     console.log('Closing stream', id)
    //     if (typeof (execStream.stream as any).destroy === 'function') {
    //       (execStream.stream as any).destroy()
    //     }
    //     this.execStreamMap.delete(id)
    //   }
    // }
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

  public async execStream(id: string): Promise<NodeJS.ReadWriteStream> {
    this.logger.debug(['execStream', JSON.stringify(Object.values(arguments))].join(' '))

    if (this.execStreamMap.has(id)) {
      this.logger.debug('Stream already exists')

      return this.execStreamMap.get(id).stream
    }

    const container = this.dockerode.getContainer(id)
    const exec = await container.exec({
      Cmd: ['bash'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
    })
    const stream = await exec.start({ hijack: true, stdin: true })
    stream.pipe(process.stdout)
    stream.write('ls\n')

    this.execStreamMap.set(id, { expireIn: Date.now() + STEAM_ALIVE_TIMEOUT, stream })

    return stream
  }

  public async execStreamAlive(id: string): Promise<void> {
    this.logger.debug(['execStreamAlive', JSON.stringify(Object.values(arguments))].join(' '))

    const streamMap = this.execStreamMap.get(id)

    if (!streamMap) {
      throw new RpcException(`execStreamAlive - Stream <${id}> not found`)
    }

    this.execStreamMap.set(id, { ...streamMap, expireIn: Date.now() + STEAM_ALIVE_TIMEOUT })
  }

  public async execStreamCmd(id: string, cmd: string): Promise<void> {
    this.logger.debug(['execStreamCmd', JSON.stringify(Object.values(arguments))].join(' '))

    const streamMap = this.execStreamMap.get(id)

    if (!streamMap) {
      throw new RpcException(`execStreamCmd - Stream <${id}> not found`)
    }

    console.log(streamMap.stream.write(cmd))
  }
}
