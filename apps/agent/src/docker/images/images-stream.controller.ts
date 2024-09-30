import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { EventPatterns } from '@the-software-compagny/dockilot_shared-types'
import { ImageInspectInfo } from 'dockerode'
import { fromEvent, map, Observable, takeUntil } from 'rxjs'
import { ImagesStreamService } from './images-stream.service'

@Controller()
export class ImagesStreamController {
  public constructor(private readonly service: ImagesStreamService) {
  }

  /**
   * Pull image by repoTag with options and auth
   *
   * @param payload { repoTag: string, options?: {}, auth?: {} }
   * @returns ImageInspectInfo
   */
  @MessagePattern(EventPatterns.IMAGES_PULL)
  public async pull(
    @Payload() payload: { repoTag: string, options?: {}, auth?: {} },
  ): Promise<ImageInspectInfo> {
    return await this.service.pull(payload.repoTag, payload?.options, payload?.auth)
  }

  /**
   * Get image stream by repoTag
   *
   * @param payload { repoTag: string }
   * @returns Observable<string>
   */
  @MessagePattern(EventPatterns.IMAGES_PULL_STREAM)
  public async pullStream(@Payload() payload: { repoTag: string }): Promise<Observable<string>> {
    const stream = await this.service.pullStream(payload.repoTag)

    const data$ = fromEvent(stream, 'data')
    const end$ = fromEvent(stream, 'end')
    const error$ = fromEvent(stream, 'error')

    return data$.pipe(
      map((chunk) => chunk.toString()),
      takeUntil(end$),
      takeUntil(error$),
    )
  }
}
