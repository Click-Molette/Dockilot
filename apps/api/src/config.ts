import { Logger, NestApplicationOptions } from '@nestjs/common'
import { SwaggerCustomOptions } from '@nestjs/swagger'
import { HelmetOptions } from 'helmet'
import Joi from 'joi'
import chalk from 'chalk'
import { getLogLevel } from './_common/_functions/get-log-level'

export const validationSchema = Joi.object({
  DOCKILOT_AGENT_LOG_LEVEL: Joi
    .string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'verbose')
    .default('debug'),
})
export interface ConfigInstance {
  application: NestApplicationOptions
  helmet: HelmetOptions
  swagger: {
    path?: string
    api?: string
    options?: SwaggerCustomOptions
  }
}

export function initializeConfig(): Promise<ConfigInstance> {
  const cfg = config()

  Logger.log(
    chalk.bold.blue(`API configured to run on <http://localhost:4000> 🧭`),
    `${chalk.bold.blue('ConfigInstance')}\x1b[33m`,
  )

  return cfg
}

const config = async (): Promise<ConfigInstance> => {
  return {
    application: {
      logger: getLogLevel(process.env['DOCKILOT_API_LOG_LEVEL']),
      cors: true,
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          objectSrc: ["'self'"],
          frameSrc: ["'self'"],
          styleSrc: ["'self'"],
          fontSrc: ["'self'"],
          imgSrc: ["'self'"],
          scriptSrc: ["'self'"],
        },
      },
    },
    swagger: {
      path: 'swagger',
      api: '/swagger/json',
      options: {},
    },
  }
}

export default config
