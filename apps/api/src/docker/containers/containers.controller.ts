import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import { ContainersService } from './containers.service'
import { ApiTags } from '@nestjs/swagger'
import { isArray } from 'radash'

@ApiTags('containers')
@Controller('containers')
export class ContainersController {
  public constructor(private readonly _service: ContainersService) { }

  /**
   * Search all containers
   *
   * @param res Response
   * @returns Response
   */
  @Get()
  public async search(
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

    const [data, total] = await this._service.search({
      all: true,
      filters,
    })

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: data.slice((page - 1) * limit, page * limit),
      total,
    })
  }

  /**
   * Create a container
   *
   * @param res Response
   * @param body any
   * @returns Response
   */
  @Post()
  public async create(@Res() res: Response, @Body() body: any): Promise<Response> {
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: await this._service.create(body),
    })
  }

  /**
   * Read a container by id
   *
   * @param res Response
   * @param id string
   * @returns Response
   */
  @Get(':id')
  public async read(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.OK,
      data: await this._service.read(id),
    })
  }

  /**
   * Update a container by id
   *
   * @param res Response
   * @param id string
   * @param body any
   * @returns Response
   */
  @Patch(':id')
  public async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.update(id, body),
    })
  }

  /**
   * Delete a container by id
   *
   * @param res Response
   * @param id string
   * @param force boolean
   * @returns Response
   */
  @Delete(':id')
  public async delete(
    @Res() res: Response,
    @Param('id') id: string,
    @Query('force', new DefaultValuePipe(false), ParseBoolPipe) force: boolean,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.delete(id, {
        force,
      }),
    })
  }

  /**
   * Start a container by id
   *
   * @param res Response
   * @param id string
   * @returns Response
   */
  @Post(':id/start')
  public async start(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.start(id),
    })
  }

  /**
   * Stop a container by id
   *
   * @param res Response
   * @param id string
   * @returns Response
   */
  @Post(':id/stop')
  public async stop(@Res() res: Response, @Param('id') id: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.stop(id),
    })
  }

  /**
   * Pause a container by id
   *
   * @param res Response
   * @param id string
   * @returns Response
   */
  @Post(':id/pause')
  public async pause(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.pause(id),
    })
  }

  /**
   * Unpause a container by id
   *
   * @param res Response
   * @param id string
   * @returns Response
   */
  @Post(':id/unpause')
  public async unpause(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.unpause(id),
    })
  }

  /**
   * Stop all containers
   *
   * @param res Response
   * @returns Response
   */
  @Post('stop-all')
  public async stopAll(@Res() res: Response): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.stopAll(),
    })
  }

  /**
   * Prune all containers
   *
   * @param res Response
   * @returns Response
   */
  @Post('prune')
  public async prune(@Res() res: Response): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.prune(),
    })
  }

  /**
   * Get stats of a container by id
   *
   * @param res Response
   * @param id string
   * @returns Response
   */
  @Get(':id/stats')
  public async stats(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.stats(id),
    })
  }
}
