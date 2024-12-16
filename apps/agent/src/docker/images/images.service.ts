import { Injectable, Logger } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectDockerode } from '@the-software-compagny/nestjs_module_dockerode'
import Dockerode, { ImageInfo, ImageInspectInfo, ListImagesOptions, PruneImagesInfo } from 'dockerode'

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name)

  public constructor(@InjectDockerode() private readonly dockerode: Dockerode) {
  }

  /**
   * Search images with options
   *
   * @param options object
   * @returns any
   */
  public async search(options: { term: string, limit?: number, filters?: string }): Promise<any> {
    this.logger.debug(['search', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.dockerode.searchImages(options)
  }

  /**
   * List images with options
   *
   * @param options ListImagesOptions
   * @returns ImageInfo[]
   */
  public async list(options?: ListImagesOptions): Promise<ImageInfo[]> {
    this.logger.debug(['list', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.dockerode.listImages(options)
  }

  /**
   * Inspect image by imageTag
   *
   * @param imageTag string
   * @returns ImageInspectInfo
   */
  public async inspect(imageTag: string): Promise<ImageInspectInfo> {
    this.logger.debug(['inspect', JSON.stringify(Object.values(arguments))].join(' '))

    const image = await this.dockerode.getImage(imageTag)

    return await image.inspect()
  }

  /**
   * Remove image by imageTag with options
   *
   * @param imageTag string
   * @param options object
   * @returns any
   */
  public async remove(imageTag: string, options?: {}): Promise<any> {
    this.logger.debug(['remove', JSON.stringify(Object.values(arguments))].join(' '))

    const image = await this.dockerode.getImage(imageTag)

    return await image.remove(options)
  }

  /**
   * History image by imageTag
   *
   * @param imageTag string
   * @returns any
   */
  public async history(imageTag: string): Promise<any> {
    this.logger.debug(['history', JSON.stringify(Object.values(arguments))].join(' '))

    const image = await this.dockerode.getImage(imageTag)

    return await image.history()
  }

  /**
   * Prune images with options
   *
   * @param options object
   * @returns PruneImagesInfo
   */
  public async prune(options?: {}): Promise<PruneImagesInfo> {
    this.logger.debug(['prune', JSON.stringify(Object.values(arguments))].join(' '))

    return await this.dockerode.pruneImages(options)
  }
}
