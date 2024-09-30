
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { DockerodeModule, DockerodeModuleOptions } from '@the-software-compagny/nestjs_module_dockerode'
import { AllExceptionsFilter } from './_common/_filters/all-exceptions.filter'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config, { validationSchema } from './config'
import { DockerModule } from './docker/docker.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    DockerodeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get<DockerodeModuleOptions>('dockerode')
      },
    }),
    ScheduleModule.forRoot(),
    DockerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
}
