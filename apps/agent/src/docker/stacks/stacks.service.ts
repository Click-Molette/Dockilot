import { Injectable, Logger } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectDockerode } from '@the-software-compagny/nestjs_module_dockerode'
import Dockerode from 'dockerode'
import { readFileSync } from 'fs'
import { parse } from 'yaml'

@Injectable()
export class StacksService {
  private readonly logger = new Logger(StacksService.name)

  public constructor(@InjectDockerode() private readonly dockerode: Dockerode) {
  }

  public async search(options: { filters?: { [key: string]: string[] } }): Promise<any> {
    this.logger.debug(['search', JSON.stringify(Object.values(arguments))].join(' '))

    const stacks = new Map<string, any>()
    const containers = await this.dockerode.listContainers({
      all: true,
      filters: {
        label: ['com.docker.compose.project'],
      },
    })

    for (const container of containers) {
      const name = container.Labels['com.docker.compose.project']
      const containerInfo = { Names: container.Names, State: container.State }

      if (options.filters && options.filters.name) {
        const regex = new RegExp(`${options.filters.name}`, 'i')
        if (!regex.test(name)) continue
      }

      if (stacks.has(name)) {
        stacks.get(name).containers.push(containerInfo)
      } else {
        stacks.set(name, {
          name,
          project: {
            config_files: container.Labels['com.docker.compose.project.config_files'],
            working_dir: container.Labels['com.docker.compose.project.working_dir'],
          },
          containers: [containerInfo],
        })
      }
    }

    return Array.from(stacks.values())
  }

  public async read(name: string, options?: {}): Promise<any> {
    this.logger.debug(['read', JSON.stringify(Object.values(arguments))].join(' '))


    const containers = await this.dockerode.listContainers({
      all: true,
      filters: {
        label: ['com.docker.compose.project=' + name],
      },
    })

    if (containers.length === 0) {
      throw new RpcException(`Stack ${name} not found`)
    }

    const config_files = containers[0].Labels['com.docker.compose.project.config_files']
    const working_dir = containers[0].Labels['com.docker.compose.project.working_dir']

    // const config_filesData = readFileSync(config_files, 'utf8')
    // const stack = parse(config_filesData)

    //TODO: read file from ssh if agent is not on the same host as the stack

    return {
      name,
      project: {
        config_files,
        working_dir,
      },
      // stack,
      containers: containers.map((container) => ({
        Names: container.Names,
        State: container.State,
      })),
    }
  }

  public async pull(options: {}): Promise<any> {
    this.logger.debug(['pull', JSON.stringify(Object.values(arguments))].join(' '))

  }

  public async down(options: {}): Promise<any> {
    this.logger.debug(['down', JSON.stringify(Object.values(arguments))].join(' '))

  }

  public async up(options: {}): Promise<any> {
    this.logger.debug(['up', JSON.stringify(Object.values(arguments))].join(' '))

  }
}
