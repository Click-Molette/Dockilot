import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ContainerUpdateOptions } from '@the-software-compagny/dockilot_shared-types'
import { ContainerCreateOptions, ContainerInfo, ContainerInspectInfo, ContainerInspectOptions, ContainerListOptions, ContainerRemoveOptions, ContainerStartOptions, ContainerStopOptions, PruneContainersInfo } from 'dockerode'
import { Observable, Subject, finalize, lastValueFrom, map, takeUntil, tap, timeout } from 'rxjs'

@Injectable()
export class ContainersService implements OnModuleInit {
  private readonly logger = new Logger(ContainersService.name)

  public constructor(@Inject('docker') private readonly client: ClientProxy) {
  }

  public async onModuleInit() {
    try {
      const res = await this.client.connect()
    } catch (err) {
      console.error('err', err)
    }
  }

  public async search(options?: ContainerListOptions): Promise<ContainerInfo[]> {
    this.logger.debug(['search', JSON.stringify(Object.values(arguments))].join(' '))

    const search$ = this.client.send<ContainerInfo[]>('docker.containers.search', { options })

    return await lastValueFrom(search$)
  }

  public async create(data: ContainerCreateOptions, options?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['create', JSON.stringify(Object.values(arguments))].join(' '))

    const create$ = this.client.send<ContainerInspectInfo>('docker.containers.create', { data, options })

    return await lastValueFrom(create$)
  }

  public async read(id: string, options?: ContainerInspectOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['read', JSON.stringify(Object.values(arguments))].join(' '))

    const read$ = this.client.send<ContainerInspectInfo>('docker.containers.read', { id, options })

    return await lastValueFrom(read$)
  }

  public async update(id: string, data: Partial<ContainerUpdateOptions>): Promise<ContainerInspectInfo> {
    this.logger.debug(['update', JSON.stringify(Object.values(arguments))].join(' '))

    const update$ = this.client.send<ContainerInspectInfo>('docker.containers.update', { id, data })

    return await lastValueFrom(update$)
  }

  public async delete(id: string, options?: ContainerRemoveOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['delete', JSON.stringify(Object.values(arguments))].join(' '))

    const delete$ = this.client.send<any>('docker.containers.delete', { id, options })

    return await lastValueFrom(delete$)
  }

  public async start(id: string, options?: ContainerStartOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['start', JSON.stringify(Object.values(arguments))].join(' '))

    const start$ = this.client.send<any>('docker.containers.start', { id, options })

    return await lastValueFrom(start$)
  }

  public async stop(id: string, options?: ContainerStopOptions): Promise<ContainerInspectInfo> {
    this.logger.debug(['stop', JSON.stringify(Object.values(arguments))].join(' '))

    const stop$ = this.client.send<any>('docker.containers.stop', { id, options })

    return await lastValueFrom(stop$)
  }

  public async stopAll(listOptions?: ContainerListOptions, stopOptions?: ContainerStopOptions): Promise<ContainerInspectInfo[]> {
    this.logger.debug(['stopAll', JSON.stringify(Object.values(arguments))].join(' '))

    const stopAll$ = this.client.send<any>('docker.containers.stop-all', { listOptions, stopOptions })

    return await lastValueFrom(stopAll$)
  }

  public async pause(id: string, options?: {}): Promise<ContainerInspectInfo> {
    this.logger.debug(['pause', JSON.stringify(Object.values(arguments))].join(' '))

    const pause$ = this.client.send<any>('docker.containers.pause', { id, options })

    return await lastValueFrom(pause$)
  }

  public async unpause(id: string, options?: {}): Promise<ContainerInspectInfo> {
    this.logger.debug(['unpause', JSON.stringify(Object.values(arguments))].join(' '))

    const unpause$ = this.client.send<any>('docker.containers.unpause', { id, options })

    return await lastValueFrom(unpause$)
  }

  public async prune(options?: {}): Promise<PruneContainersInfo> {
    this.logger.debug(['prune', JSON.stringify(Object.values(arguments))].join(' '))

    const prune$ = this.client.send<any>('docker.containers.prune', { options })

    return await lastValueFrom(prune$)
  }

  public async stats(id: string): Promise<PruneContainersInfo> {
    this.logger.debug(['stats', JSON.stringify(Object.values(arguments))].join(' '))

    const stats$ = this.client.send<any>('docker.containers.stats', { id })

    return await lastValueFrom(stats$)
  }
}
