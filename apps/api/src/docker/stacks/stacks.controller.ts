import { ApiTags } from '@nestjs/swagger'
import { StacksService } from './stacks.service'
import { Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { isArray } from 'radash'

@ApiTags('stacks')
@Controller('stacks')
export class StacksController {
  public constructor(private readonly _service: StacksService) { }

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
      filters,
    })

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: data.slice((page - 1) * limit, page * limit),
      total,
    })
  }

  @Get(':name')
  public async read(
    @Res() res: Response,
    @Param('name') name: string,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.read(name),
    })
  }

  @Get(':name/pull')
  public async pull(
    @Res() res: Response,
    @Param('name') name: string,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.pull(name),
    })
  }

  @Get(':name/up')
  public async up(
    @Res() res: Response,
    @Param('name') name: string,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.up(name),
    })
  }

  @Get(':name/down')
  public async down(
    @Res() res: Response,
    @Param('name') name: string,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.down(name),
    })
  }

  @Get(':name/ps')
  public async ps(
    @Res() res: Response,
    @Param('name') name: string,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this._service.ps(name),
    })
  }
}
