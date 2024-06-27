import { Module } from "@nestjs/common"
import { ContainersController } from "./containers.controller"
import { ContainersService } from "./containers.service"
import { ContainersStreamController } from "./containers-stream.controller"
import { ContainersStreamService } from "./containers-stream.service"

@Module({
  controllers: [ContainersController, ContainersStreamController],
  providers: [ContainersService, ContainersStreamService],
})
export class ContainersModule { }
