import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RequestContextModule } from '@the-software-compagny/nestjs_module_restools'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config from './config'
import { DockerodeModule } from './dockerode'
import { readFileSync } from 'node:fs'
import { DockerModule } from './docker/docker.module'
import { SocketModule } from './socket/socket.module'

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
    // RequestContextModule,
    DockerModule.register(),
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
