import { Controller, Get, HttpStatus, Res } from "@nestjs/common"
import { AppService } from "./app.service"
import { Response } from "express"
import Dockerode from 'dockerode'
import DockerodeCompose from 'dockerode-compose'
import { InjectDockerode } from "./dockerode"

@Controller()
export class AppController {
  public constructor(private readonly _service: AppService, @InjectDockerode() private readonly docker: Dockerode) {
    // const compose = new DockerodeCompose(docker, '')
  }

  @Get()
  public async getInfos(@Res() res: Response) {
    const test = await this.docker.info()
    console.log(test)
    // const test2 = await this.docker.getContainer('transfer-sh-transfer-sh-1').inspect()
    const test2 = await this.docker.getContainer('transfer-sh-transfer-sh-1').stats({ 'one-shot': true, stream: false })
    console.log(test2)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: this._service.getInfos(),
      test2
    })
  }
}
