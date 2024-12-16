import { Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Query, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ImagesService } from './images.service'
import { Response } from 'express'
import { isArray } from 'radash'

@ApiTags('images')
@Controller('images')
export class ImagesController {
  public constructor(private readonly _service: ImagesService) { }

  /**
   * List images with options
   *
   * @param res Response
   * @returns Response
   */
  @Get('list')
  public async list(
    @Res() res: Response,
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
    @Query('filters') filters: {
      [key: string]: string[],
    },
  ): Promise<Response> {
    for (const key in filters) {
      filters[key] = isArray(filters[key]) ? filters[key] : [filters[key]]
    }

    const [data, total] = await this._service.list({
      filters,
    })

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: data.slice((page - 1) * limit, page * limit),
      total,
    })
  }

  /**
   * Search images with options
   *
   * @param res Response
   * @param term string
   * @param filters string
   * @param limit number
   * @returns Response
   */
  @Get('search')
  public async search(
    @Res() res: Response,
    @Query('term') term: string,
    @Query('filters') filters: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.search({ term, filters, limit }),
    })
  }

  /**
   * Inspect image by imageTag
   *
   * @param res Response
   * @param imageTag string
   * @returns Response
   */
  @Get('inspect/:imageTag')
  public async inspect(
    @Res() res: Response,
    @Param('imageTag') imageTag: string,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.inspect(imageTag),
    })
  }

  /**
   * Remove image by imageTag
   *
   * @param res Response
   * @param imageTag string
   * @returns Response
   */
  @Get('remove/:imageTag')
  public async remove(
    @Res() res: Response,
    @Param('imageTag') imageTag: string,
  ): Promise<Response> {
    await this._service.remove(imageTag)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: `Image ${imageTag} removed`,
    })
  }

  /**
   * Get image history by imageTag
   *
   * @param res Response
   * @param imageTag string
   * @returns Response
   */
  @Get('history/:imageTag')
  public async history(
    @Res() res: Response,
    @Param('imageTag') imageTag: string,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.history(imageTag),
    })
  }

  /**
   * Prune images with options
   *
   * @param res Response
   * @returns Response
   */
  @Get('prune')
  public async prune(@Res() res: Response): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.prune(),
    })
  }
}
