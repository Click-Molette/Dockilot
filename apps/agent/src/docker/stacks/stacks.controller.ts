import { Controller } from '@nestjs/common'
import { StacksService } from './stacks.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { EventPatterns } from '@the-software-compagny/dockilot_shared-types'

@Controller()
export class StacksController {
  public constructor(private readonly service: StacksService) {
  }

  @MessagePattern(EventPatterns.STACKS_SEARCH)
  public async search(
    @Payload() payload: { options?: { filters?: { [key: string]: string[] } } },
  ): Promise<any> {
    return this.service.search(payload?.options)
  }

  @MessagePattern(EventPatterns.STACKS_READ)
  public async read(
    @Payload() payload: { name: string, options?: {} },
  ): Promise<any> {
    return this.service.read(payload.name, payload?.options)
  }

  @MessagePattern(EventPatterns.STACKS_PULL)
  public async pull(
    @Payload() payload: { name: string, options?: {} },
  ): Promise<any> {
    return this.service.pull(payload.name, payload?.options)
  }

  @MessagePattern(EventPatterns.STACKS_DOWN)
  public async down(
    @Payload() payload: { name: string, options?: {} },
  ): Promise<any> {
    return this.service.down(payload.name, payload?.options)
  }

  @MessagePattern(EventPatterns.STACKS_UP)
  public async up(
    @Payload() payload: { name: string, options?: {} },
  ): Promise<any> {
    return this.service.up(payload.name, payload?.options)
  }

  @MessagePattern(EventPatterns.STACKS_PS)
  public async ps(
    @Payload() payload: { name: string, options?: {} },
  ): Promise<any> {
    return this.service.ps(payload.name, payload?.options)
  }
}
