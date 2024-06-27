
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import config from './config'
import { readFileSync } from 'node:fs'
import { DockerodeModule } from '@the-software-compagny/nestjs_module_dockerode'
import { AppController } from './app.controller'
import { DockerModule } from './docker/docker.module'
import { AllExceptionsFilter } from './_common/_filters/all-exceptions.filter'
import { APP_FILTER } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DockerodeModule.forRoot({
      config: {
        protocol: 'ssh',
        host: '192.168.1.34',
        port: 22,
        username: 'root',
        sshOptions: {
          host: '192.168.1.34',
          port: 22,
          username: 'root',
          // password: 'google',
          // password: 'google',
          privateKey: readFileSync('c:/Users/tacxtv/.ssh/id_ed25519'),
          // debug: (data) => console.log(data.toString()),
        },
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
    }
  ],
})
export class AppModule {
}
