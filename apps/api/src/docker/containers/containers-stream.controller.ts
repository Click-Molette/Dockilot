import { Controller, Logger, Param, Res, Sse } from '@nestjs/common'
import { Response } from 'express'
import { map, tap } from 'rxjs'
import { ContainersStreamService } from './containers-stream.service'

@Controller('containers')
export class ContainersStreamController {
  public constructor(private readonly service: ContainersStreamService) { }

  @Sse(':id/stats-stream')
  public async statsSse(@Res() res: Response, @Param('id') id: string) {
    const observable = this.service.statsStream(id);

    const interval = setInterval(() => {
      this.service.statsStreamAlive(id);
    }, 1000)

    res.socket.on('close', () => {
      Logger.debug(`Observer close connection`, this.constructor.name)
      clearInterval(interval)
    });

    return observable

    // const close$ = new Subject<void>()
    // const observable = this.service.statsStream(id);

    // res.socket.on('close', () => {
    //   Logger.debug(`Observer close connection`, this.constructor.name);
    //   close$.next();
    //   close$.complete();
    // });

    // observable.pipe()

    // const observable = observable.pipe(map((chunk) => {
    //   return JSON.stringify(chunk.toString())
    // }))

    // return observable.pipe(
    //   tap((chunk) => console.log('Received chunk:', chunk)),
    //   map((chunk) => JSON.stringify(chunk.toString())),
    //   takeUntil(close$)
    // );
  }
}
