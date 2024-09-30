import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'
import { initializeConfig } from './config'

const APP_NAME = process.env.npm_package_name.split('/').pop().toLocaleUpperCase()

declare const module: any;
(async () => {
  const cfg = await initializeConfig()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, cfg.application)

  await app.listen()

  Logger.log(chalk.bold.blue(`Microservice is now listening 🟢`), `${chalk.bold.blue(APP_NAME)}\x1b[33m`)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
})()
