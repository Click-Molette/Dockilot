import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { EventPatterns } from '@the-software-compagny/dockilot_shared-types'
import { ImageInfo, ImageInspectInfo, ListImagesOptions } from 'dockerode'
import { lastValueFrom } from 'rxjs'
import { observableTimeoutCatch } from '~/_common/_functions/observable-timeout-catch.function'

@Injectable()
export class ImagesService implements OnModuleInit {
  protected readonly logger = new Logger(ImagesService.name)

  public constructor(@Inject('docker') private readonly _client: ClientProxy) {
  }

  public async onModuleInit(): Promise<void> {
    try {
      const res = await this._client.connect()
    } catch (err) {
      console.error('err', err)
    }
  }

  /**
   * Search images in DockerHub with options
   *
   * @param options { term: string, limit?: number, filters?: string }
   * @returns any
   */
  public async search(options?: { term: string, limit?: number, filters?: string }): Promise<any> {
    this.logger.debug(['search', JSON.stringify(Object.values(arguments))].join(' '))

    const search$ = this._client.send<any>(EventPatterns.IMAGES_SEARCH, { options })

    return await lastValueFrom(observableTimeoutCatch(search$))
  }

  /**
   * List local images with options
   *
   * @param options ListImagesOptions
   * @returns [ImageInfo[], number]
   */
  public async list(options?: ListImagesOptions): Promise<[ImageInfo[], number]> {
    this.logger.debug(['list', JSON.stringify(Object.values(arguments))].join(' '))

    const list$ = this._client.send<ImageInfo[]>(EventPatterns.IMAGES_LIST, { options })
    const data = await lastValueFrom(observableTimeoutCatch(list$))

    return [data, data.length]
  }

  /**
   * Prune local images with options
   *
   * @param options object
   * @returns ImageInfo[]
   */
  public async prune(options?: {}): Promise<ImageInfo[]> {
    this.logger.debug(['prune', JSON.stringify(Object.values(arguments))].join(' '))

    const prune$ = this._client.send<ImageInfo[]>(EventPatterns.IMAGES_PRUNE, { options })

    return await lastValueFrom(observableTimeoutCatch(prune$))
  }

  /**
   * Inspect image by imageTag
   *
   * @param imageTag string
   * @returns ImageInspectInfo
   */
  public async inspect(imageTag: string): Promise<ImageInspectInfo> {
    this.logger.debug(['inspect', JSON.stringify(Object.values(arguments))].join(' '))

    const inspect$ = this._client.send<ImageInspectInfo>(EventPatterns.IMAGES_INSPECT, { imageTag })

    return await lastValueFrom(observableTimeoutCatch(inspect$))
  }

  /**
   * Remove image by imageTag
   *
   * @param imageTag string
   * @param options object
   * @returns void
   */
  public async remove(imageTag: string, options?: {}): Promise<void> {
    this.logger.debug(['remove', JSON.stringify(Object.values(arguments))].join(' '))

    const remove$ = this._client.send<void>(EventPatterns.IMAGES_REMOVE, { imageTag, options })

    return await lastValueFrom(observableTimeoutCatch(remove$))
  }

  /**
   * History of image by imageTag
   *
   * @param imageTag string
   * @returns
   */
  public async history(imageTag: string): Promise<any> {
    this.logger.debug(['history', JSON.stringify(Object.values(arguments))].join(' '))

    const history$ = this._client.send<any>(EventPatterns.IMAGES_HISTORY, { imageTag })

    return await lastValueFrom(observableTimeoutCatch(history$))
  }
}
