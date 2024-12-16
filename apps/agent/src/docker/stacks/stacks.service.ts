import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RpcException } from '@nestjs/microservices'
import { InjectDockerode } from '@the-software-compagny/nestjs_module_dockerode'
import { AbstractStorage, FactorydriveService } from '@the-software-compagny/nestjs_module_factorydrive'
import Dockerode from 'dockerode'
import Compose from 'dockerode-compose'
import { parse } from 'yaml'
import { ComposeService } from './_services/compose.service'

@Injectable()
export class StacksService {
  private readonly logger = new Logger(StacksService.name)
  private readonly stackStorage: AbstractStorage
  private readonly rootStacksPath: string

  public constructor(
    @InjectDockerode() private readonly dockerode: Dockerode,
    private readonly storage: FactorydriveService,
    private readonly config: ConfigService,
    private readonly compose: ComposeService,
  ) {
    this.stackStorage = this.storage.getDisk('stacks')
    this.rootStacksPath = this.config.get<string>('factorydrive.options.disks.stacks.config.root')

    if (!this.rootStacksPath) {
      throw new Error('Missing rootStacksPath in config')
    }

    this.logger.log('StacksService initialized 🚀')
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

    const stack = await this.compose.read(name, options)

    return stack
  }

  public async pull(name: string, options?: {}): Promise<any> {
    this.logger.debug(['pull', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.compose.pull(name, options)
  }

  public async ps(name: string, options?: {}): Promise<any> {
    this.logger.debug(['ps', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.compose.ps(name, options)
  }

  public async down(name: string, options?: {}): Promise<any> {
    this.logger.debug(['down', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.compose.down(name, options)
  }

  public async up(name: string, options?: {}): Promise<any> {
    this.logger.debug(['up', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.compose.up(name, options)
  }
}
