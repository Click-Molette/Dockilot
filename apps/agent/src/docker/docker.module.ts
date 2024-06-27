import { Module } from "@nestjs/common"
import { ContainersModule } from "./containers/containers.module"

@Module({
  imports: [ContainersModule],
})
export class DockerModule { }
