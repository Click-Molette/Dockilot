import { Logger } from '@nestjs/common'
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DockerodeModuleOptions } from '@the-software-compagny/nestjs_module_dockerode'
import chalk from 'chalk'
import Joi from 'joi'
import { existsSync, readFileSync } from 'node:fs'
import { getLogLevel } from './_common/_functions/get-log-level'
import { LocalFileSystemStorageConfig, StorageManagerConfig } from '@the-software-compagny/nestjs_module_factorydrive'
import { SFTPStorageConfig } from '@the-software-compagny/nestjs_module_factorydrive-sftp'

export const validationSchema = Joi.object({
  DOCKILOT_AGENT_LOG_LEVEL: Joi
    .string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'verbose')
    .default('debug'),

  DOCKILOT_AGENT_MS_TRANSPORT: Joi
    .string()
    .valid(...Object.keys(Transport).filter(key => isNaN(Number(key))))
    .default(Transport.TCP),
  DOCKILOT_AGENT_MS_HOST: Joi
    .string()
    .ip()
    .default('localhost'),
  DOCKILOT_AGENT_MS_PORT: Joi
    .number()
    .port()
    .default(5000),

  DOCKILOT_AGENT_DOCKERODE_PROTOCOL: Joi
    .string()
    .valid('ssh', 'http', 'https')
    .default('http'),
  DOCKILOT_AGENT_DOCKERODE_HOST: Joi
    .string()
    .ip()
    .default('localhost'),
  DOCKILOT_AGENT_DOCKERODE_PORT: Joi
    .number()
    .port()
    .default(2375),
  DOCKILOT_AGENT_DOCKERODE_USERNAME: Joi.optional(),

  DOCKILOT_AGENT_STORAGE_DRIVER: Joi
    .valid('sftp', 'local')
    .optional(),
  DOCKILOT_AGENT_STORAGE_STACKS_ROOT: Joi
    .string()
    .pattern(new RegExp('^(/[^/ ]*)+/?$'))
    .required(),
  DOCKILOT_AGENT_STORAGE_VOLUMES_ROOT: Joi
    .string()
    .pattern(new RegExp('^(/[^/ ]*)+/?$'))
    .optional(),
})

export interface ConfigInstance {
  application: NestApplicationContextOptions & MicroserviceOptions & {
    transport: Transport,
  },
  dockerode: DockerodeModuleOptions,
  factorydrive: {
    options:
    | StorageManagerConfig
    | {
      disks: {
        [key: string]: {
          driver: 'sftp' | 'local',
          config: SFTPStorageConfig | LocalFileSystemStorageConfig,
        },
      },
    },
  },
}

export async function initializeConfig(): Promise<ConfigInstance> {
  const cfg = await config()

  Logger.log(
    chalk.bold.blue(`Microservice configured with ${process.env['DOCKILOT_AGENT_MS_TRANSPORT']} transport 🚚`),
    `${chalk.bold.blue('ConfigInstance')}\x1b[33m`,
  )

  return cfg
}

const config = async (): Promise<ConfigInstance> => {
  const dockerodeOptions = {}
  switch (process.env['DOCKILOT_AGENT_DOCKERODE_PROTOCOL']) {
    case 'https': {
      try {
        dockerodeOptions['ca'] = readFileSync('c:/Users/tacxtv/.docker/ca.pem')
        dockerodeOptions['cert'] = readFileSync('c:/Users/tacxtv/.docker/cert.pem')
        dockerodeOptions['key'] = readFileSync('c:/Users/tacxtv/.docker/key.pem')
      } catch (error) {
        Logger.error(`Error reading dockerode certificates: ${error.message}`, `${chalk.bold.cyan('ConfigInstance')}\x1b[33m`)
        process.stdout.write(`${error.stack}\n`)
      }
      break
    }

    case 'ssh': {
      dockerodeOptions['sshOptions'] = {}
      dockerodeOptions['sshOptions']['host'] = process.env['DOCKILOT_AGENT_DOCKERODE_SSH_HOST']
      dockerodeOptions['sshOptions']['port'] = parseInt(process.env['DOCKILOT_AGENT_DOCKERODE_SSH_PORT'], 10)
      dockerodeOptions['sshOptions']['username'] = process.env['DOCKILOT_AGENT_DOCKERODE_SSH_USERNAME']
      dockerodeOptions['sshOptions']['password'] = process.env['DOCKILOT_AGENT_DOCKERODE_SSH_PASSWORD']

      try {
        if (existsSync(process.env['DOCKILOT_AGENT_DOCKERODE_SSH_PRIVATEKEY'])) {
          dockerodeOptions['sshOptions']['privateKey'] = readFileSync(process.env['DOCKILOT_AGENT_DOCKERODE_SSH_PRIVATEKEY'])
        } else {
          dockerodeOptions['sshOptions']['privateKey'] = process.env['DOCKILOT_AGENT_DOCKERODE_SSH_PRIVATEKEY']
        }
      } catch (error) {
        Logger.error(`Error reading dockerode ssh private key: ${error.message}`, `${chalk.bold.cyan('ConfigInstance')}\x1b[33m`)
        process.stdout.write(`${error.stack}\n`)
      }
      break
    }
  }

  const factoryDriveDiskConfig = {}
  let factoryDriveDriver = process.env['DOCKILOT_AGENT_STORAGE_DRIVER']

  if (!factoryDriveDriver) {
    if (process.env['DOCKILOT_AGENT_DOCKERODE_PROTOCOL'] === 'ssh') {
      factoryDriveDriver = 'sftp'
    } else {
      factoryDriveDriver = 'local'
    }
  }

  if (factoryDriveDriver === 'sftp') {
    factoryDriveDiskConfig['options'] = dockerodeOptions?.['sshOptions']
  }

  return {
    application: {
      logger: getLogLevel(process.env['DOCKILOT_AGENT_LOG_LEVEL']),
      transport: Transport[process.env['DOCKILOT_AGENT_MS_TRANSPORT']],
      options: {
        host: process.env['DOCKILOT_AGENT_MS_HOST'],
        port: parseInt(process.env['DOCKILOT_AGENT_MS_PORT'], 10),
        retryAttempts: 9999,
        retryDelay: 5000,
        showFriendlyErrorStack: true,
      },
    },
    dockerode: {
      config: {
        ...dockerodeOptions,
        protocol: <'ssh' | 'http' | 'https'>process.env['DOCKILOT_AGENT_DOCKERODE_PROTOCOL'],
        host: process.env['DOCKILOT_AGENT_DOCKERODE_HOST'],
        port: parseInt(process.env['DOCKILOT_AGENT_DOCKERODE_PORT'], 10),
        username: process.env['DOCKILOT_AGENT_DOCKERODE_USERNAME'],
        sshOptions: {
          ...dockerodeOptions?.['sshOptions'],
          debug: (data) => Logger.verbose(data.toString(), `${chalk.bold.cyan('DockerodeSSH')}\x1b[33m`),
        },
      },
    },
    factorydrive: {
      options: {
        disks: {
          stacks: {
            driver: factoryDriveDriver,
            config: <LocalFileSystemStorageConfig | SFTPStorageConfig>{
              root: process.env['DOCKILOT_AGENT_STORAGE_STACKS_ROOT'],
              options: dockerodeOptions?.['sshOptions'],
              ...factoryDriveDiskConfig,
            },
          },
          volumes: {
            driver: factoryDriveDriver,
            config: <LocalFileSystemStorageConfig | SFTPStorageConfig>{
              root: process.env['DOCKILOT_AGENT_STORAGE_VOLUMES_ROOT'] || process.env['DOCKILOT_AGENT_STORAGE_STACKS_ROOT'],
              ...factoryDriveDiskConfig,
            },
          },
        },
      },
    },
  }
}

export default config
