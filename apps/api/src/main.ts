import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'
import { initializeConfig } from './config'

const APP_NAME = process.env.npm_package_name.split('/').pop().toLocaleUpperCase()

declare const module: any;
(async () => {
  Logger.log(chalk.bold.blue(`Starting ${APP_NAME} 🚀`), `${chalk.bold.blue(APP_NAME)}\x1b[33m`)
  const cfg = await initializeConfig()
  const app = await NestFactory.create<NestExpressApplication>(AppModule, cfg.application)

  if (process.env.production !== 'production') {
    Logger.warn(chalk.redBright(`Running in development mode 🛠`), `${chalk.redBright(APP_NAME)}\x1b[33m`);
    (await import('./swagger')).default(app)
  }

  setupGracefulShutdown({ app })

  await app.listen(4000, () => {
    Logger.log(chalk.bold.blue(`API is running on <http://localhost:4000> 🟢`), `${chalk.bold.blue(APP_NAME)}\x1b[33m`)
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
})()
