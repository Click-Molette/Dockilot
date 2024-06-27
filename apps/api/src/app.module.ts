import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
// import { RequestContextModule } from '@the-software-compagny/nestjs_module_restools'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config from './config'
// import { DockerodeModule } from './dockerode'
// import { readFileSync } from 'node:fs'
import { DockerModule } from './docker/docker.module'
import { SocketModule } from './socket/socket.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AllExceptionsFilter } from './_common/_filters/all-exceptions.filter'
import { APP_FILTER } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    // DockerodeModule.forRoot({
    //   config: {
    //     protocol: 'ssh',
    //     host: '192.168.1.34',
    //     port: 22,
    //     username: 'root',
    //     sshOptions: {
    //       host: '192.168.1.34',
    //       port: 22,
    //       username: 'root',
    //       // password: 'google',
    //       // password: 'google',
    //       privateKey: readFileSync('c:/Users/tacxtv/.ssh/id_ed25519'),
    //       // debug: (data) => console.log(data.toString()),
    //     },
    //   },
    // }),
    // RequestContextModule,
    ClientsModule.register({
      clients: [
        { name: 'docker', transport: Transport.TCP, options: { host: 'localhost', port: 5000 } },
      ],
      isGlobal: true,

    }),
    DockerModule.register(),
    SocketModule,
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
