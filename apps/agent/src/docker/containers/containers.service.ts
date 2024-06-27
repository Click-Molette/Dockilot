import { Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { InjectDockerode } from "@the-software-compagny/nestjs_module_dockerode"
import { ContainerUpdateOptions } from '@the-software-compagny/dockilot_shared-types'
import Dockerode, {
  ContainerCreateOptions,
  ContainerInfo,
  ContainerInspectInfo,
  ContainerInspectOptions,
  ContainerListOptions,
  ContainerRemoveOptions,
  ContainerStartOptions,
  ContainerStats,
  ContainerStopOptions,
  PruneContainersInfo,
} from "dockerode"

@Injectable()
export class ContainersService implements OnModuleInit {
  private readonly logger = new Logger(ContainersService.name)

  public constructor(@InjectDockerode() private readonly dockerode: Dockerode) {
  }

  public async onModuleInit(): Promise<void> {
    const events = await this.dockerode.getEvents()

    events.on('data', async (data) => {
      // const event = JSON.parse(data.toString())

      // console.log('event', event)

      try {
        // const container = await this.dockerode.getContainer(event.id).inspect()
        // console.log('container', container)
        // this.socket.server.emit('container', JSON.stringify({
        //   event,
        //   container,
        // }))
      } catch (error) {
        console.error(error)
      }
    })
  }

  public async search(options?: ContainerListOptions): Promise<ContainerInfo[]> {
    this.logger.debug(['search', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.dockerode.listContainers(options)
  }

  public async create(data: ContainerCreateOptions, options?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['create', JSON.stringify(Object.values(arguments))].join(' '))

    const container = await this.dockerode.createContainer({ ...data })

    return container.inspect(options)
  }

  public async read(id: string, options?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['read', JSON.stringify(Object.values(arguments))].join(' '))

    return this.dockerode.getContainer(id).inspect(options)
  }

  public async update(id: string, data?: ContainerUpdateOptions, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['update', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.update(data)

    return container.inspect(inspectOptions)
  }

  public async delete(id: string, removeOptions?: ContainerRemoveOptions, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['delete', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    const inspect = await container.inspect(inspectOptions)
    await container.remove(removeOptions)

    return inspect
  }

  public async start(id: string, startOptions?: ContainerStartOptions, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['start', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.start(startOptions)

    return container.inspect(inspectOptions)
  }

  public async stop(id: string, stopOptions?: ContainerStopOptions, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['stop', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.stop(stopOptions)

    return container.inspect(inspectOptions)
  }

  public async pause(id: string, pauseOptions?: {}, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['pause', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.pause(pauseOptions)

    return container.inspect(inspectOptions)
  }

  public async unpause(id: string, unpauseOptions?: {}, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['unpause', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.unpause(unpauseOptions)

    return container.inspect(inspectOptions)
  }

  public async stopAll(listOptions?: ContainerListOptions, stopOptions?: ContainerStopOptions): Promise<ContainerInspectInfo[]> {
    this.logger.debug(['stopAll', JSON.stringify(Object.values(arguments))].join(' '))

    const stops = []
    const containers = await this.search(listOptions)

    for await (const container of containers) {
      stops.push(this.stop(container.Id, stopOptions))
    }

    return await Promise.all(stops)
  }

  public async prune(options?: {}): Promise<PruneContainersInfo> {
    this.logger.debug(['prune', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.dockerode.pruneContainers(options)
  }

  public async stats(id: string): Promise<ContainerStats> {
    this.logger.debug(['stats', JSON.stringify(Object.values(arguments))].join(' '))

    const container = await this.dockerode.getContainer(id)

    return await container.stats({ stream: false })
  }
}
