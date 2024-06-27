import { Body, Controller, DefaultValuePipe, Delete, Get, HttpStatus, Param, ParseBoolPipe, Patch, Post, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { ContainersService } from './containers.service'

@Controller('containers')
export class ContainersController {
  public constructor(private readonly service: ContainersService) { }

  @Get()
  public async search(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.search(),
    })
  }

  @Post()
  public async create(@Res() res: Response, @Body() body: any) {
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.OK,
      data: await this.service.create(body),
    })
  }

  @Get(':id')
  public async read(@Res() res: Response, @Param('id') id: string) {
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.OK,
      data: await this.service.read(id),
    })
  }

  @Patch(':id')
  public async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.update(id, body),
    })
  }

  @Delete(':id')
  public async delete(
    @Res() res: Response,
    @Param('id') id: string,
    @Query('force', new DefaultValuePipe(false), ParseBoolPipe) force: boolean,
  ) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.delete(id, {
        force,
      }),
    })
  }

  @Post(':id/start')
  public async start(@Res() res: Response, @Param('id') id: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.start(id),
    })
  }

  @Post(':id/stop')
  public async stop(@Res() res: Response, @Param('id') id: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.stop(id),
    })
  }

  @Post(':id/pause')
  public async pause(@Res() res: Response, @Param('id') id: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.pause(id),
    })
  }

  @Post(':id/unpause')
  public async unpause(@Res() res: Response, @Param('id') id: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.unpause(id),
    })
  }

  @Post('stop-all')
  public async stopAll(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.stopAll(),
    })
  }

  @Post('prune')
  public async prune(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.prune(),
    })
  }

  @Get(':id/stats')
  public async stats(@Res() res: Response, @Param('id') id: string) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: await this.service.stats(id),
    })
  }
}
