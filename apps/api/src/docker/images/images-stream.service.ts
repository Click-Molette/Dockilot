import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { EventPatterns } from '@the-software-compagny/dockilot_shared-types'
import { ImageInspectInfo } from 'dockerode'
import { lastValueFrom, Observable, tap, timeout } from 'rxjs'
import { observableTimeoutCatch } from '~/_common/_functions/observable-timeout-catch.function'

@Injectable()
export class ImagesStreamService implements OnModuleInit {
  protected readonly logger = new Logger(ImagesStreamService.name)

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
   * Pull image by repoTag with options and auth
   *
   * @param repoTag string
   * @param options object
   * @param auth object
   * @returns ImageInspectInfo
   */
  public async pull(repoTag: string, options?: {}, auth?: {}): Promise<ImageInspectInfo> {
    this.logger.debug(['pull', JSON.stringify(Object.values(arguments))].join(' '))

    const pull$ = this._client.send<ImageInspectInfo>(EventPatterns.IMAGES_PULL, { repoTag, options, auth })

    return await lastValueFrom(observableTimeoutCatch(pull$))
  }

  /**
   * Get image stream by repoTag
   *
   * @param repoTag string
   * @returns Observable<NodeJS.ReadableStream>
   */
  public pullStream(repoTag: string): Observable<NodeJS.ReadableStream> {
    const pullStream$ = this._client.send<any>(EventPatterns.IMAGES_PULL_STREAM, { repoTag })

    return pullStream$.pipe(
      timeout(10_000),
      tap((chunk) => this.logger.verbose('Received chunk:', chunk.toString())),
    )
  }
}
