import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config, { validationSchema } from './config'
import { DockerModule } from './docker/docker.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AllExceptionsFilter } from './_common/_filters/all-exceptions.filter'
import { APP_FILTER } from '@nestjs/core'
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown'

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    ClientsModule.register({
      isGlobal: true,
      clients: [
        // { name: 'docker', transport: Transport.TCP, options: { host: 'localhost', port: 5000 } },
        {
          name: 'docker',
          transport: Transport.REDIS,
          options: {
            host: '192.168.1.200',
            port: 6379,
            retryAttempts: 99999,
            retryDelay: 5000,
            showFriendlyErrorStack: true,
          },
        },
      ],
    }),
    DockerModule.register(),
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
