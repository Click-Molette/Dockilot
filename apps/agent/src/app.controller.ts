import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AppService } from './app.service'
import { PackageJson } from 'types-package-json'

@Controller()
export class AppController {
  public constructor(private readonly service: AppService) {
  }

  @MessagePattern({ cmd: 'agent.infos' })
  getInfos(): Partial<PackageJson> {
    return this.service.getInfos()
  }
}
