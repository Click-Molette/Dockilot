import { Controller, Logger, Param, Res, Sse } from '@nestjs/common'
import { Response } from 'express'
import { ContainersStreamService } from './containers-stream.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('containers')
@Controller('containers')
export class ContainersStreamController {
  public constructor(private readonly _service: ContainersStreamService) { }

  @Sse(':id/stats-stream')
  public async statsSse(@Res() res: Response, @Param('id') id: string) {
    const observable = this._service.statsStream(id)

    const interval = setInterval(() => {
      this._service.statsStreamAlive(id)
    }, 1_000)

    res.socket.on('close', () => {
      Logger.debug(`Observer close connection`, this.constructor.name)
      clearInterval(interval)
    });

    return observable
  }

  @Sse('global-state')
  public globalStateSse(@Res() res: Response) {
    const observable = this._service.globalStateStream()

    // const interval = setInterval(() => {
    //   this.service.globalStateStreamAlive();
    // }, 1000)

    res.socket.on('close', () => {
      Logger.debug(`Observer close connection`, this.constructor.name)
      // clearInterval(interval)
    });

    return observable
  }
}
