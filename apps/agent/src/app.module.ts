
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import config from './config'
import { DockerodeCoreModule } from './dockerode/dockerode.core-module'
import { readFileSync } from 'node:fs'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DockerodeCoreModule.forRoot({
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
  ],
  providers: [AppService],
})
export class AppModule {
}
