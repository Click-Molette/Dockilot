import { Controller, Get, HttpStatus, Res } from "@nestjs/common"
import { AppService } from "./app.service"
import { Response } from "express"

@Controller()
export class AppController {
  public constructor(private readonly _service: AppService) {
  }

  @Get()
  public async getInfos(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: this._service.getInfos(),
    })
  }
}
