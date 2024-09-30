import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Client, ClientProxy, ClientProxyFactory } from '@nestjs/microservices'
import { ContainerUpdateOptions, EventPatterns } from '@the-software-compagny/dockilot_shared-types'
import {
  ContainerCreateOptions,
  ContainerInfo,
  ContainerInspectInfo,
  ContainerInspectOptions,
  ContainerListOptions,
  ContainerRemoveOptions,
  ContainerStartOptions,
  ContainerStopOptions,
  PruneContainersInfo,
} from 'dockerode'
import { lastValueFrom } from 'rxjs'
import { observableTimeoutCatch } from '~/_common/_functions/observable-timeout-catch.function'

@Injectable()
export class ContainersService implements OnModuleInit {
  protected readonly logger = new Logger(ContainersService.name)

  public constructor(@Inject('docker') private readonly _client: ClientProxy) {
  }

  public async onModuleInit() {
    try {
      const res = await this._client.connect()
    } catch (err) {
      console.error('err', err)
    }
  }

  /**
   * List containers
   *
   * @param options ContainerListOptions
   * @returns [ContainerInfo[], number]
   */
  public async search(options?: ContainerListOptions): Promise<[ContainerInfo[], number]> {
    this.logger.debug(['search', JSON.stringify(Object.values(arguments))].join(' '))

    const search$ = this._client.send<ContainerInfo[]>(EventPatterns.CONTAINER_SEARCH, { options })
    const data = await lastValueFrom(observableTimeoutCatch(search$))

    return [data, data.length]
  }

  /**
   * Create container with options
   *
   * @param data ContainerCreateOptions
   * @param options ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async create(data: ContainerCreateOptions, options?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['create', JSON.stringify(Object.values(arguments))].join(' '))

    const create$ = this._client.send<ContainerInspectInfo>(EventPatterns.CONTAINER_CREATE, { data, options })

    return await lastValueFrom(observableTimeoutCatch(create$))
  }

  /**
   * Read container
   *
   * @param id string
   * @param options ContainerInspectOptions
   * @returns ContainerInspectInfo
   */
  public async read(id: string, options?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['read', JSON.stringify(Object.values(arguments))].join(' '))

    const read$ = this._client.send<ContainerInspectInfo>(EventPatterns.CONTAINER_READ, { id, options })

    return await lastValueFrom(observableTimeoutCatch(read$))
  }

  /**
   * Update container
   *
   * @param id string
   * @param data Partial<ContainerUpdateOptions>
   * @returns ContainerInspectInfo
   */
  public async update(id: string, data: Partial<ContainerUpdateOptions>): Promise<ContainerInspectInfo> {
    this.logger.debug(['update', JSON.stringify(Object.values(arguments))].join(' '))

    const update$ = this._client.send<ContainerInspectInfo>(EventPatterns.CONTAINER_UPDATE, { id, data })

    return await lastValueFrom(observableTimeoutCatch(update$))
  }

  /**
   * Delete container
   *
   * @param id string
   * @param options ContainerRemoveOptions
   * @returns ContainerInspectInfo
   */
  public async delete(id: string, options?: ContainerRemoveOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['delete', JSON.stringify(Object.values(arguments))].join(' '))

    const delete$ = this._client.send<any>(EventPatterns.CONTAINER_DELETE, { id, options })

    return await lastValueFrom(observableTimeoutCatch(delete$))
  }

  /**
   * Start container
   *
   * @param id string
   * @param options ContainerStartOptions
   * @returns ContainerInspectInfo
   */
  public async start(id: string, options?: ContainerStartOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['start', JSON.stringify(Object.values(arguments))].join(' '))

    const start$ = this._client.send<any>(EventPatterns.CONTAINER_START, { id, options })

    return await lastValueFrom(observableTimeoutCatch(start$))
  }

  /**
   * Stop container
   *
   * @param id string
   * @param options ContainerStopOptions
   * @returns ContainerInspectInfo
   */
  public async stop(id: string, options?: ContainerStopOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['stop', JSON.stringify(Object.values(arguments))].join(' '))

    const stop$ = this._client.send<any>(EventPatterns.CONTAINER_STOP, { id, options })

    return await lastValueFrom(observableTimeoutCatch(stop$))
  }

  /**
   * Stop all containers
   *
   * @param listOptions ContainerListOptions
   * @param stopOptions ContainerStopOptions
   * @returns ContainerInspectInfo[]
   */
  public async stopAll(listOptions?: ContainerListOptions, stopOptions?: ContainerStopOptions): Promise<ContainerInspectInfo[]> {
    this.logger.debug(['stopAll', JSON.stringify(Object.values(arguments))].join(' '))

    const stopAll$ = this._client.send<any>(EventPatterns.CONTAINER_STOP_ALL, { listOptions, stopOptions })

    return await lastValueFrom(observableTimeoutCatch(stopAll$))
  }

  /**
   * Pause container
   *
   * @param id string
   * @param options object
   * @returns ContainerInspectInfo
   */
  public async pause(id: string, options?: {}): Promise<ContainerInspectInfo> {
    this.logger.debug(['pause', JSON.stringify(Object.values(arguments))].join(' '))

    const pause$ = this._client.send<any>(EventPatterns.CONTAINER_PAUSE, { id, options })

    return await lastValueFrom(observableTimeoutCatch(pause$))
  }

  /**
   * Unpause container
   *
   * @param id string
   * @param options object
   * @returns ContainerInspectInfo
   */
  public async unpause(id: string, options?: {}): Promise<ContainerInspectInfo> {
    this.logger.debug(['unpause', JSON.stringify(Object.values(arguments))].join(' '))

    const unpause$ = this._client.send<any>(EventPatterns.CONTAINER_UNPAUSE, { id, options })

    return await lastValueFrom(observableTimeoutCatch(unpause$))
  }

  /**
   * Prune containers
   *
   * @param options object
   * @returns PruneContainersInfo
   */
  public async prune(options?: {}): Promise<PruneContainersInfo> {
    this.logger.debug(['prune', JSON.stringify(Object.values(arguments))].join(' '))

    const prune$ = this._client.send<any>(EventPatterns.CONTAINER_PRUNE, { options })

    return await lastValueFrom(observableTimeoutCatch(prune$))
  }

  /**
   * Get container stats
   *
   * @param id string
   * @returns PruneContainersInfo
   */
  public async stats(id: string): Promise<PruneContainersInfo> {
    this.logger.debug(['stats', JSON.stringify(Object.values(arguments))].join(' '))

    const stats$ = this._client.send<any>(EventPatterns.CONTAINER_STATS, { id })

    return await lastValueFrom(observableTimeoutCatch(stats$))
  }
}
