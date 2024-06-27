import { Controller } from "@nestjs/common"
import { MessagePattern, Payload } from "@nestjs/microservices"
import { ContainerUpdateOptions } from '@the-software-compagny/dockilot_shared-types'
import { ContainerCreateOptions, ContainerInfo, ContainerInspectInfo, ContainerInspectOptions, ContainerListOptions, ContainerRemoveOptions, ContainerStartOptions, ContainerStopOptions } from "dockerode"
import { ContainersService } from "./containers.service"

@Controller()
export class ContainersController {
  public constructor(private readonly service: ContainersService) {
  }

  @MessagePattern('docker.containers.search')
  public async search(@Payload() payload: { options?: ContainerListOptions }): Promise<ContainerInfo[]> {
    return this.service.search(payload?.options)
  }

  @MessagePattern('docker.containers.create')
  public async create(@Payload() payload: { data: ContainerCreateOptions, options?: ContainerInspectOptions }): Promise<ContainerInspectInfo> {
    return this.service.create(payload.data, payload.options)
  }

  @MessagePattern('docker.containers.read')
  public async read(@Payload() payload: { id: string, options?: ContainerInspectOptions }) {
    return this.service.read(payload.id, payload?.options)
  }

  @MessagePattern('docker.containers.update')
  public async update(@Payload() payload: { id: string, data?: ContainerUpdateOptions, options?: ContainerInspectOptions }) {
    console.log('payload', payload)
    return this.service.update(payload.id, payload?.data, payload?.options)
  }

  @MessagePattern('docker.containers.delete')
  public async delete(@Payload() payload: { id: string, options?: ContainerRemoveOptions }) {
    return this.service.delete(payload.id, payload?.options)
  }

  @MessagePattern('docker.containers.start')
  public async start(@Payload() payload: { id: string, options?: ContainerStartOptions }) {
    return this.service.start(payload.id, payload?.options)
  }

  @MessagePattern('docker.containers.stop')
  public async stop(@Payload() payload: { id: string, options?: ContainerStopOptions }) {
    return this.service.stop(payload.id, payload?.options)
  }

  @MessagePattern('docker.containers.stop-all')
  public async stopAll(@Payload() payload: { listOptions?: ContainerListOptions, stopOptions?: ContainerStopOptions }) {
    return this.service.stopAll(payload?.listOptions, payload?.stopOptions)
  }

  @MessagePattern('docker.containers.pause')
  public async pause(@Payload() payload: { id: string, options?: {} }) {
    return this.service.pause(payload.id, payload?.options)
  }

  @MessagePattern('docker.containers.unpause')
  public async unpause(@Payload() payload: { id: string, options?: {} }) {
    return this.service.unpause(payload.id, payload?.options)
  }

  @MessagePattern('docker.containers.prune')
  public async prune(@Payload() payload: { options?: {} }) {
    return this.service.prune(payload?.options)
  }

  @MessagePattern('docker.containers.stats')
  public async stats(@Payload() payload: { id: string }) {
    return this.service.stats(payload.id)
  }
}
