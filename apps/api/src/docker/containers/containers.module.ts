import { Module } from '@nestjs/common'
import { ContainersController } from './containers.controller'
import { ContainersService } from './containers.service'
import { ContainersStreamController } from './containers-stream.controller'
import { ContainersStreamService } from './containers-stream.service'
import { ContainersGateway } from './containers.gateway'

@Module({
  controllers: [
    ContainersStreamController,
    ContainersController,
  ],
  providers: [
    ContainersStreamService,
    ContainersService,
    ContainersGateway,
  ],
})
export class ContainersModule { }
