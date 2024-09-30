import { Controller, Get, HttpStatus, Logger, Query, Res, Sse } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ImagesStreamService } from './images-stream.service'
import { Response } from 'express'

@ApiTags('images')
@Controller('images')
export class ImagesStreamController {
  public constructor(private readonly _service: ImagesStreamService) { }

  /**
   * Prune images with options
   *
   * @param res Response
   * @returns Response
   */
  @Get('pull')
  public async pull(
    @Res() res: Response,
    @Query('repoTag') repoTag: string,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.pull(repoTag),
    })
  }

  @Sse('pull-stream')
  public async statsSse(
    @Res() res: Response,
    @Query('repoTag') repoTag: string,
  ) {
    const observable = this._service.pullStream(repoTag)

    res.socket.on('close', () => {
      Logger.debug(`Observer close connection`, this.constructor.name)
    });

    return observable
  }
}
