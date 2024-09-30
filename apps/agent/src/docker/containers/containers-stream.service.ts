import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Interval } from '@nestjs/schedule'
import { InjectDockerode } from '@the-software-compagny/nestjs_module_dockerode'
import Dockerode from 'dockerode'

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

  private globalStateStreamStorage: NodeJS.ReadableStream

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

    for (const [id, execStream] of this.execStreamMap.entries()) {
      if (execStream.expireIn < Date.now()) {
        console.log('Closing stream', id)
        if (typeof (execStream.stream as any).destroy === 'function') {
          (execStream.stream as any).destroy()
        }
        this.execStreamMap.delete(id)
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

  public async checkShellAvailability(containerId: string): Promise<{ hasBash: boolean; hasSh: boolean }> {
    const exec = await this.dockerode.getContainer(containerId).exec({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['sh', '-c', 'command -v bash; command -v sh'],
    })

    const stream = await exec.start({ Detach: false, Tty: false })

    return new Promise((resolve, reject) => {
      let output = ''

      stream.on('data', (data) => {
        output += data.toString()
      })

      stream.on('end', () => {
        const hasBash = output.includes('bash')
        const hasSh = output.includes('sh')
        resolve({ hasBash, hasSh })
      })

      stream.on('error', (err) => {
        reject(err)
      })
    })
  }

  public async execStream(clientId: string, containerId: string): Promise<NodeJS.ReadWriteStream> {
    this.logger.debug(['execStream', JSON.stringify(Object.values(arguments))].join(' '))

    // if (this.execStreamMap.has(`${clientId}:${containerId}`)) {
    //   this.logger.debug('Stream already exists')

    //   return this.execStreamMap.get(`${clientId}:${containerId}`).stream
    // }

    const container = this.dockerode.getContainer(containerId)
    const shellAvailability = await this.checkShellAvailability(containerId)
    // console.log('shellAvailability', JSON.stringify(shellAvailability))

    const exec = await container.exec({
      // Cmd: ['bash'],
      Cmd: shellAvailability.hasBash ? ['bash'] : ['sh'],
      AttachStderr: true,
      AttachStdout: true,
      AttachStdin: true,
      Tty: true,
    })

    const stream = await exec.start({
      stdin: true,
      Tty: true,
      // hijack: true,
    })

    this.execStreamMap.set(`${clientId}:${containerId}`, { expireIn: Date.now() + STEAM_ALIVE_TIMEOUT, stream })

    return stream
  }

  public async execStreamAlive(clientId: string, containerId: string): Promise<void> {
    // this.logger.debug(['execStreamAlive', JSON.stringify(Object.values(arguments))].join(' '))

    const streamMap = this.execStreamMap.get(`${clientId}:${containerId}`)

    if (!streamMap) {
      throw new RpcException(`execStreamAlive - Stream <${clientId}:${containerId}> not found`)
    }

    this.execStreamMap.set(`${clientId}:${containerId}`, { ...streamMap, expireIn: Date.now() + STEAM_ALIVE_TIMEOUT })
  }

  public async execStreamFinalize(clientId: string, containerId: string): Promise<void> {
    this.logger.debug(['execStreamFinalize', JSON.stringify(Object.values(arguments))].join(' '))

    const streamMap = this.execStreamMap.get(`${clientId}:${containerId}`)

    if (!streamMap) {
      throw new RpcException(`execStreamFinalize - Stream <${clientId}:${containerId}> not found`)
    }

    streamMap?.stream?.end()
    this.execStreamMap.delete(`${clientId}:${containerId}`)
  }

  public async execStreamCmd(clientId: string, containerId: string, cmd: string): Promise<void> {
    this.logger.debug(['execStreamCmd', JSON.stringify(Object.values(arguments))].join(' '))

    const streamMap = this.execStreamMap.get(`${clientId}:${containerId}`)

    if (!streamMap) {
      throw new RpcException(`execStreamCmd - Stream <${clientId}:${containerId}> not found`)
    }

    console.log('cmd', JSON.stringify(cmd))
    streamMap.stream.write(cmd)
  }

  public async globalStateStream(): Promise<NodeJS.ReadableStream> {
    this.logger.debug(['globalStateStream', JSON.stringify(Object.values(arguments))].join(' '))

    if (this.globalStateStreamStorage) {
      this.logger.debug('Stream already exists')

      return this.globalStateStreamStorage
    }

    const stream = await this.dockerode.getEvents({
      filters: {
        type: ['container'],
      },
    })

    this.globalStateStreamStorage = stream

    return stream
  }
}
