import { Controller } from '@nestjs/common'
import { ImagesService } from './images.service'
import { EventPatterns } from '@the-software-compagny/dockilot_shared-types'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ImageInfo, ImageInspectInfo, ListImagesOptions, PruneImagesInfo } from 'dockerode'

@Controller()
export class ImagesController {
  public constructor(private readonly service: ImagesService) {
  }

  /**
   * Search images with options
   *
   * @param payload { options?: { term: string, limit?: number, filters?: string } }
   * @returns any
   */
  @MessagePattern(EventPatterns.IMAGES_SEARCH)
  public async search(
    @Payload() payload: { options?: { term: string, limit?: number, filters?: string } },
  ): Promise<any> {
    return this.service.search(payload?.options)
  }

  /**
   * List images with options
   *
   * @param payload { options?: ListImagesOptions }
   * @returns ImageInfo[]
   */
  @MessagePattern(EventPatterns.IMAGES_LIST)
  public async list(
    @Payload() payload: { options?: ListImagesOptions },
  ): Promise<ImageInfo[]> {
    return this.service.list(payload?.options)
  }

  /**
   * Prune images with options
   *
   * @param payload { options?: {} }
   * @returns PruneImagesInfo
   */
  @MessagePattern(EventPatterns.IMAGES_PRUNE)
  public async prune(
    @Payload() payload: { options?: {} },
  ): Promise<PruneImagesInfo> {
    return this.service.prune(payload?.options)
  }

  /**
   * Inspect image by imageTag
   *
   * @param payload { imageTag: string }
   * @returns ImageInspectInfo
   */
  @MessagePattern(EventPatterns.IMAGES_INSPECT)
  public async inspect(
    @Payload() payload: { imageTag: string },
  ): Promise<ImageInspectInfo> {
    return this.service.inspect(payload.imageTag)
  }

  /**
   * Remove image by imageTag
   *
   * @param payload { imageTag: string }
   * @returns any
   */
  @MessagePattern(EventPatterns.IMAGES_REMOVE)
  public async remove(
    @Payload() payload: { imageTag: string, options?: {} },
  ): Promise<any> {
    return this.service.remove(payload.imageTag, payload.options)
  }

  /**
   * History of image by imageTag
   *
   * @param payload { imageTag: string }
   * @returns
   */
  @MessagePattern(EventPatterns.IMAGES_HISTORY)
  public async history(
    @Payload() payload: { imageTag: string },
  ): Promise<any> {
    return this.service.history(payload.imageTag)
  }
}
