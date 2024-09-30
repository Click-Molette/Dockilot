import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ContainerUpdateOptions, EventPatterns } from '@the-software-compagny/dockilot_shared-types'
import {
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
import { ContainersService } from './containers.service'
import { PrefixedMessagePattern } from '~/_common/_decorators/prefixed-message-pattern.decorator'

@Controller()
export class ContainersController {
  public constructor(private readonly service: ContainersService) {
  }

  /**
   * Search all containers with optional filters
   *
   * @param payload { options?: ContainerListOptions }
   * @returns ContainerInfo[]
   */
  @PrefixedMessagePattern(EventPatterns.CONTAINER_SEARCH)
  public async search(
    @Payload() payload: { options?: ContainerListOptions },
  ): Promise<ContainerInfo[]> {
    console.log('search', payload)
    return this.service.search(payload?.options)
  }

  /**
   * Read a container by id with optional inspect options
   *
   * @param payload { id: string, options?: ContainerInspectOptions }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_READ)
  public async read(
    @Payload() payload: { id: string, options?: ContainerInspectOptions },
  ): Promise<ContainerInspectInfo> {
    return this.service.read(payload.id, payload?.options)
  }

  /**
   * Create a container with optional inspect options
   *
   * @param payload { data: ContainerCreateOptions, options?: ContainerInspectOptions }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_CREATE)
  public async create(
    @Payload() payload: { data: ContainerCreateOptions, options?: ContainerInspectOptions },
  ): Promise<ContainerInspectInfo> {
    return this.service.create(payload.data, payload.options)
  }

  /**
   * Update a container by id with optional update options and inspect options
   *
   * @param payload { id: string, data?: ContainerUpdateOptions, options?: ContainerInspectOptions }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_UPDATE)
  public async update(
    @Payload() payload: { id: string, data?: ContainerUpdateOptions, options?: ContainerInspectOptions },
  ): Promise<ContainerInspectInfo> {
    return this.service.update(payload.id, payload?.data, payload?.options)
  }

  /**
   * Delete a container by id with optional remove options
   *
   * @param payload { id: string, options?: ContainerRemoveOptions }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_DELETE)
  public async delete(
    @Payload() payload: { id: string, options?: ContainerRemoveOptions },
  ): Promise<ContainerInspectInfo> {
    return this.service.delete(payload.id, payload?.options)
  }

  /**
   * Start a container by id with optional start options
   *
   * @param payload { id: string, options?: ContainerStartOptions }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_START)
  public async start(
    @Payload() payload: { id: string, options?: ContainerStartOptions },
  ): Promise<ContainerInspectInfo> {
    return this.service.start(payload.id, payload?.options)
  }

  /**
   * Restart a container by id with optional restart options
   *
   * @param payload { id: string, options?: object }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_RESTART)
  public async restart(
    @Payload() payload: { id: string, options?: object },
  ): Promise<ContainerInspectInfo> {
    return this.service.restart(payload.id, payload?.options)
  }

  /**
   * Stop a container by id with optional stop options
   *
   * @param payload { id: string, options?: ContainerStopOptions }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_STOP)
  public async stop(
    @Payload() payload: { id: string, options?: ContainerStopOptions },
  ): Promise<ContainerInspectInfo> {
    return this.service.stop(payload.id, payload?.options)
  }

  /**
   * Stop all containers with optional list options and stop options
   *
   * @param payload { listOptions?: ContainerListOptions, stopOptions?: ContainerStopOptions }
   * @returns ContainerInspectInfo[]
   */
  @MessagePattern(EventPatterns.CONTAINER_STOP_ALL)
  public async stopAll(
    @Payload() payload: { listOptions?: ContainerListOptions, stopOptions?: ContainerStopOptions },
  ): Promise<ContainerInspectInfo[]> {
    return this.service.stopAll(payload?.listOptions, payload?.stopOptions)
  }

  /**
   * Pause a container by id with optional pause options
   *
   * @param payload { id: string, options?: {} }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_PAUSE)
  public async pause(
    @Payload() payload: { id: string, options?: {} },
  ): Promise<ContainerInspectInfo> {
    return this.service.pause(payload.id, payload?.options)
  }

  /**
   * Unpause a container by id with optional pause options
   *
   * @param payload { id: string, options?: {} }
   * @returns ContainerInspectInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_UNPAUSE)
  public async unpause(
    @Payload() payload: { id: string, options?: {} },
  ): Promise<ContainerInspectInfo> {
    return this.service.unpause(payload.id, payload?.options)
  }

  /**
   * Prune all containers with optional prune options
   *
   * @param payload { options?: {} }
   * @returns PruneContainersInfo
   */
  @MessagePattern(EventPatterns.CONTAINER_PRUNE)
  public async prune(
    @Payload() payload: { options?: {} },
  ): Promise<PruneContainersInfo> {
    return this.service.prune(payload?.options)
  }

  /**
   * Get container stats by id
   *
   * @param payload { id: string }
   * @returns ContainerStats
   */
  @MessagePattern(EventPatterns.CONTAINER_STATS)
  public async stats(
    @Payload() payload: { id: string },
  ): Promise<ContainerStats> {
    return this.service.stats(payload.id)
  }
}
