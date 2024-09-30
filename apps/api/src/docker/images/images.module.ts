import { ImagesStreamController } from './images-stream.controller'
import { Module } from '@nestjs/common'
import { ImagesController } from './images.controller'
import { ImagesService } from './images.service'
import { ImagesStreamService } from './images-stream.service'

@Module({
  controllers: [
    ImagesStreamController,
    ImagesController,
  ],
  providers: [
    ImagesStreamService,
    ImagesService,
  ],
})
export class ImagesModule { }
