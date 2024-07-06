import { Module } from '@nestjs/common'
import { ContainersController } from './containers.controller'
import { ContainersService } from './containers.service'
import { SocketService } from '~/socket/socket.service'
import { ContainersStreamController } from './containers-stream.controller'
import { ContainersStreamService } from './containers-stream.service'
import { ContainersGateway } from './containers.gateway'

@Module({
  controllers: [ContainersController, ContainersStreamController],
  providers: [ContainersService, ContainersStreamService, SocketService, ContainersGateway],
})
export class ContainersModule { }
