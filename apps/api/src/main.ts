import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'

declare const module: any
(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  })

  if (process.env.production !== 'production') {
    (await import('./swagger')).default(app)
  }

  await app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000')
  })
})()
