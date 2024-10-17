import { Module } from '@nestjs/common'
import { StacksController } from './stacks.controller'
import { StacksService } from './stacks.service'
import { ComposeService } from './_services/compose.service'

@Module({
  controllers: [StacksController],
  providers: [StacksService, ComposeService],
})
export class StacksModule { }
