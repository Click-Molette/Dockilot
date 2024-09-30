import { Module } from '@nestjs/common'
import { ContainersModule } from './containers/containers.module'
import { ImagesModule } from './images/images.module'
import { StacksModule } from './stacks/stacks.module'

@Module({
  imports: [
    ContainersModule,
    ImagesModule,
    StacksModule,
  ],
})
export class DockerModule { }
