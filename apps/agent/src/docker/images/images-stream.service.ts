import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { InjectDockerode } from '@the-software-compagny/nestjs_module_dockerode'
import Dockerode, { Image, ImageInspectInfo } from 'dockerode'
import { PassThrough } from 'node:stream'
import { Callback } from '~/_common/_types/callback.type'
import chalk from 'chalk'

export const STEAM_ALIVE_TIMEOUT = 10_000

@Injectable()
export class ImagesStreamService {
  private readonly logger = new Logger(ImagesStreamService.name)

  private pullStreamMap = new Map<string, {
    expireIn: number,
    stream: NodeJS.ReadableStream,
  }>()

  public constructor(@InjectDockerode() private readonly dockerode: Dockerode) {
  }

  @Interval(STEAM_ALIVE_TIMEOUT)
  handleInterval() {
    for (const [repoTag, image] of this.pullStreamMap.entries()) {
      if (image.expireIn < Date.now()) {
        this.logger.debug(['handleInterval', 'Closing stream', repoTag].join(' '))

        if (typeof (image.stream as any).destroy === 'function') {
          (image.stream as any).destroy()
        }
        this.pullStreamMap.delete(repoTag)
      }
    }
  }

  /**
   * Pull image by repoTag with options and auth
   *
   * @param repoTag string
   * @param options object
   * @param auth object
   * @returns Image
   */
  public async pull(repoTag: string, options: {}, auth?: {}): Promise<ImageInspectInfo> {
    this.logger.debug(['pull', JSON.stringify(Object.values(arguments))].join(' '))

    const callback: Callback<NodeJS.ReadableStream> = async (error: Error, stream: NodeJS.ReadableStream) => {
      if (error) {
        console.error('error', error)
        throw error
      }

      stream.on('data', (chunk) => {
        try {
          const data = JSON.parse(chunk.toString())
          this.logger.debug(chalk.gray(`${data?.status}`))
        } catch (_) {
          this.logger.debug(chalk.gray(`${chunk.toString()}`))
        }
      })

      await this.pipePullStream(repoTag, stream)
    }

    await this.dockerode.pull(repoTag, options, callback, auth)

    return await this.dockerode.getImage(repoTag).inspect()
  }

  /**
   * Return image stream download by repoTag
   *
   * @param repoTag string
   * @returns NodeJS.ReadableStream
   */
  public async pullStream(repoTag: string): Promise<NodeJS.ReadableStream> {
    if (this.pullStreamMap.has(repoTag)) {
      const image = this.pullStreamMap.get(repoTag)
      image.expireIn = Date.now() + STEAM_ALIVE_TIMEOUT

      return image.stream
    }

    return await this.initializePullStream(repoTag)
  }

  private async initializePullStream(repoTag: string): Promise<NodeJS.ReadableStream> {
    const stream = new PassThrough()

    this.pullStreamMap.set(repoTag, {
      expireIn: Date.now() + STEAM_ALIVE_TIMEOUT,
      stream,
    })

    return stream
  }

  private async pipePullStream(repoTag: string, stream: NodeJS.ReadableStream) {
    let remoteStream = this.pullStreamMap.get(repoTag)
    if (!remoteStream) {
      remoteStream = {
        expireIn: Date.now() + STEAM_ALIVE_TIMEOUT,
        stream: await this.initializePullStream(repoTag),
      }
    }

    stream.pipe(remoteStream.stream as any)

    stream.on('end', () => {
      this.logger.debug(['pipePullStream', 'end', repoTag].join(' '))
      this.pullStreamMap.delete(repoTag)
    })
  }
}
