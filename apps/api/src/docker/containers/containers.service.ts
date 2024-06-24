import { Injectable, OnModuleInit } from '@nestjs/common'
import Dockerode, { ContainerRemoveOptions, ContainerStartOptions, ContainerStopOptions } from 'dockerode'
import { InjectDockerode } from '~/dockerode'
import { SocketGateway } from '~/socket/socket.gateway'

@Injectable()
export class ContainersService implements OnModuleInit {
  public constructor(
    @InjectDockerode() private readonly docker: Dockerode,
    private readonly socket: SocketGateway,
  ) { }
  public async onModuleInit() {
    const events = await this.docker.getEvents()

    events.on('data', async (data) => {
      const event = JSON.parse(data.toString())

      console.log('event', event)

      try {
        const container = await this.docker.getContainer(event.id).inspect()
        this.socket.server.emit('container', JSON.stringify({
          event,
          container,
        }))
      } catch (error) {
        console.error(error)
      }
    })
  }

  public async search() {
    return this.docker.listContainers()
  }

  public async create() {
    const container = await this.docker.createContainer({
      Image: 'busybox',
      Cmd: ['/bin/sh', '-c', 'while true; do echo hello world; sleep 1; done'],
    })
    return container.inspect()
  }

  public async read(id: string) {
    return this.docker.getContainer(id).inspect()
  }

  public async update() { }

  public async delete(id: string, options?: ContainerRemoveOptions) {
    return this.docker.getContainer(id).remove(options)
  }

  public async start(id: string, options?: ContainerStartOptions) {
    return this.docker.getContainer(id).start(options)
  }

  public async stop(id: string, options?: ContainerStopOptions) {
    return this.docker.getContainer(id).stop(options)
  }

  public async pause(id: string) {
    return this.docker.getContainer(id).pause()
  }

  public async unpause(id: string) {
    return this.docker.getContainer(id).unpause()
  }
}
