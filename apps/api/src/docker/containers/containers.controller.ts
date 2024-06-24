import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ContainersService } from './containers.service'

@Controller('containers')
export class ContainersController {
  public constructor(private readonly service: ContainersService) { }

  @Get()
  public async search() {
    return this.service.search()
  }

  @Post()
  public async create() {
    return this.service.create()
  }

  @Get(':id')
  public async read(@Param('id') id: string) {
    return this.service.read(id)
  }

  @Patch(':id')
  public async update() {
    return this.service.update()
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.service.delete(id)
  }

  @Post(':id/start')
  public async start(@Param('id') id: string) {
    return this.service.start(id)
  }

  @Post(':id/stop')
  public async stop(@Param('id') id: string) {
    return this.service.stop(id)
  }

  @Post(':id/pause')
  public async pause(@Param('id') id: string) {
    return this.service.pause(id)
  }

  @Post(':id/unpause')
  public async unpause(@Param('id') id: string) {
    return this.service.unpause(id)
  }
}
