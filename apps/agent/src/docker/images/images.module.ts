import { Module } from '@nestjs/common'
import { ImagesController } from './images.controller'
import { ImagesService } from './images.service'
import { ImagesStreamService } from './images-stream.service'
import { ImagesStreamController } from './images-stream.controller'

@Module({
  controllers: [ImagesController, ImagesStreamController],
  providers: [ImagesService, ImagesStreamService],
})
export class ImagesModule { }
