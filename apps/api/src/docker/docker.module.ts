import { DynamicModule, Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { DockerController } from './docker.controller'
import { DockerService } from './docker.service'
import { ContainersModule } from './containers/containers.module'

@Module({
  imports: [
    ContainersModule,
  ],
  controllers: [DockerController],
  providers: [DockerService],
})
export class DockerModule {
  public static register(): DynamicModule {
    return {
      module: this,
      imports: [
        RouterModule.register([
          {
            path: 'docker',
            children: [...Reflect.getMetadata('imports', this)],
          },
        ])
      ],
    }
  }
}
