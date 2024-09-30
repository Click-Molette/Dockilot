import { Injectable, Logger } from '@nestjs/common'
import { InjectDockerode } from '@the-software-compagny/nestjs_module_dockerode'
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
} from 'dockerode'

@Injectable()
export class ContainersService {
  private readonly logger = new Logger(ContainersService.name)

  public constructor(@InjectDockerode() private readonly dockerode: Dockerode) {
  }

  /**
   * Search containers with options
   *
   * @param options ContainerListOptions
   * @returns ContainerInfo[]
   */
  public async search(options?: ContainerListOptions): Promise<ContainerInfo[]> {
    this.logger.debug(['search', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.dockerode.listContainers(options)
  }

  /**
   * Create container with data and options
   *
   * @param data ContainerCreateOptions
   * @param options ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async create(data: ContainerCreateOptions, options?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['create', JSON.stringify(Object.values(arguments))].join(' '))

    const container = await this.dockerode.createContainer({ ...data })

    return container.inspect(options)
  }

  /**
   * Read container data by id with options
   *
   * @param id string
   * @param options ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async read(id: string, options?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['read', JSON.stringify(Object.values(arguments))].join(' '))

    return this.dockerode.getContainer(id).inspect(options)
  }

  /**
   * Update container data by id with options
   *
   * @param id string
   * @param data ContainerUpdateOptions
   * @param inspectOptions ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async update(id: string, data?: ContainerUpdateOptions, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['update', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.update(data)

    return container.inspect(inspectOptions)
  }

  /**
   * Delete container by id with options
   *
   * @param id string
   * @param removeOptions ContainerRemoveOptions
   * @param inspectOptions ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async delete(id: string, removeOptions?: ContainerRemoveOptions, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['delete', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    const inspect = await container.inspect(inspectOptions)
    await container.remove(removeOptions)

    return inspect
  }

  /**
   * Start container by id with options
   *
   * @param id string
   * @param startOptions ContainerStartOptions
   * @param inspectOptions ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async start(id: string, startOptions?: ContainerStartOptions, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['start', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.start(startOptions)

    return container.inspect(inspectOptions)
  }

  /**
   * Restart container by id with options
   *
   * @param id string
   * @param restartOptions object
   * @param inspectOptions ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async restart(id: string, restartOptions?: {}, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['restart', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.restart(restartOptions)

    return container.inspect(inspectOptions)
  }

  /**
   * Stop container by id with options
   *
   * @param id string
   * @param stopOptions ContainerStopOptions
   * @param inspectOptions ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async stop(id: string, stopOptions?: ContainerStopOptions, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['stop', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.stop(stopOptions)

    return container.inspect(inspectOptions)
  }

  /**
   * Pause container by id with options
   *
   * @param id string
   * @param pauseOptions object
   * @param inspectOptions ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async pause(id: string, pauseOptions?: {}, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['pause', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.pause(pauseOptions)

    return container.inspect(inspectOptions)
  }

  /**
   * Unpause container by id with options
   *
   * @param id string
   * @param unpauseOptions object
   * @param inspectOptions ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async unpause(id: string, unpauseOptions?: {}, inspectOptions?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['unpause', JSON.stringify(Object.values(arguments))].join(' '))

    const container = this.dockerode.getContainer(id)
    await container.unpause(unpauseOptions)

    return container.inspect(inspectOptions)
  }

  /**
   * Stop all containers with options
   *
   * @param listOptions ContainerListOptions
   * @param stopOptions ContainerStopOptions
   * @returns ContainerInspectInfo[]
   */
  public async stopAll(listOptions?: ContainerListOptions, stopOptions?: ContainerStopOptions): Promise<ContainerInspectInfo[]> {
    this.logger.debug(['stopAll', JSON.stringify(Object.values(arguments))].join(' '))

    const stops = []
    const containers = await this.search(listOptions)

    for await (const container of containers) {
      stops.push(this.stop(container.Id, stopOptions))
    }

    return await Promise.all(stops)
  }

  /**
   * Prune containers with options
   *
   * @param options object
   * @returns PruneContainersInfo
   */
  public async prune(options?: {}): Promise<PruneContainersInfo> {
    this.logger.debug(['prune', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.dockerode.pruneContainers(options)
  }

  /**
   * Get container stats by id
   *
   * @param id string
   * @returns ContainerStats
   */
  public async stats(id: string): Promise<ContainerStats> {
    this.logger.debug(['stats', JSON.stringify(Object.values(arguments))].join(' '))

    const container = await this.dockerode.getContainer(id)

    return await container.stats({ stream: false })
  }
}
