import { filter } from 'rxjs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Config, NodeSSH, SSHExecCommandOptions } from 'node-ssh'
import os from 'os'
import { posix } from 'path'
import { PromisifySpawnOptions, spawn } from 'promisify-child-process'
import qs from 'qs'
import { construct, crush, isNumber, isObject, omit } from 'radash'
import { FactorydriveService } from '@the-software-compagny/nestjs_module_factorydrive';
import { parse } from 'yaml';
import { RpcException } from '@nestjs/microservices';

export interface ExecCommandResponse {
  stdout: string
  stderr: string
  code: number | null
  signal: string | null
}

@Injectable()
export class ComposeService implements OnModuleInit {
  private readonly logger = new Logger(ComposeService.name)

  private readonly ssh = new NodeSSH()
  private readonly rootStacksPath: string

  public constructor(private readonly config: ConfigService, private readonly storage: FactorydriveService) {
    this.rootStacksPath = this.config.get<string>('factorydrive.options.disks.stacks.config.root')

    if (!this.rootStacksPath) {
      throw new Error('Missing rootStacksPath in config')
    }
  }

  public async onModuleInit() {
    if (this.config.get<'ssh' | 'http' | 'https'>('dockerode.config.protocol') === 'ssh') {
      const sshOptions = this.config.get<Config>('dockerode.config.sshOptions')

      if (sshOptions.privateKey) {
        sshOptions.privateKey = Buffer.from(sshOptions.privateKey, 'utf8').toString()
      }

      await this.ssh.connect(sshOptions)
      this.logger.log('SSH connection established 🖲️')
    }
    this.logger.log('ComposeService initialized 🚀')
  }

  public async ps(
    composeFile: string,
    options?: {
      all?: boolean,
      quiet?: boolean,
      services?: string[],
      filter?: string[],
      format?: string,
      orphan?: boolean,
      status?: string[],
      'no-trunc'?: boolean,
      'dry-run'?: boolean,
    },
  ): Promise<any> {
    options = { all: true, ...options, format: 'json' }
    this.logger.verbose(['ps', JSON.stringify(Object.values(arguments))].join(' '))

    const composePath = await this._composeNameToPath(composeFile)
    const rawData = await this._exec(`docker`, ['compose', '-f', posix.basename(composePath), 'ps', options], {
      cwd: posix.dirname(composePath),
    })

    const result = []
    for (const line of rawData.stdout.split('\n')) {
      try {
        const json = JSON.parse(line)
        const data = {
          ...omit(json, [
            'Command',
            'Mounts',
            'Labels',
            'Ports',
          ]),
          Labels: qs.parse(json.Labels, { delimiter: ',' }),
          Ports: qs.parse(json.Ports.replace(/->/g, '='), { delimiter: ', ' }),
        }
        result.push(data)
      } catch (error) {
        this.logger.error('Error parsing docker-compose ps output', error.message, error.stack)
      }
    }

    return result
  }

  public async down(
    composeFile: string,
    options?: {
      'rmi'?: string,
      'timeout'?: number,
      'volumes'?: boolean,
      'dry-run'?: boolean,
      'remove-orphans'?: boolean,
    },
  ): Promise<any> {
    this.logger.verbose(['down', JSON.stringify(Object.values(arguments))].join(' '))

    const composePath = await this._composeNameToPath(composeFile)
    const rawData = await this._exec(`docker`, ['compose', '-f', posix.basename(composePath), 'down', options], {
      cwd: posix.dirname(composePath),
    })

    console.log(rawData)

    for (const line of rawData.stdout.split('\n')) {
      console.log(line)
    }

    return null
  }

  public async up(
    composeFile: string,
    options?: {
    },
  ): Promise<any> {
    options = { ...options, detach: true }
    this.logger.verbose(['up', JSON.stringify(Object.values(arguments))].join(' '))

    const composePath = await this._composeNameToPath(composeFile)
    const rawData = await this._exec(`docker`, ['compose', '-f', posix.basename(composePath), 'upa', options], {
      cwd: posix.dirname(composePath),
    })

    console.log(rawData)

    for (const line of rawData.stdout.split('\n')) {
      console.log(line)
    }

    return null
  }

  public async pull(
    composeFile: string,
    options?: {
    },
  ): Promise<any> {
    this.logger.verbose(['pull', JSON.stringify(Object.values(arguments))].join(' '))

    const composePath = await this._composeNameToPath(composeFile)
    const rawData = await this._exec(`docker`, ['compose', '-f', posix.basename(composePath), 'pull', options], {
      cwd: posix.dirname(composePath),
    })

    console.log(rawData)

    for (const line of rawData.stdout.split('\n')) {
      console.log(line)
    }

    return null
  }

  public async read(composeFile: string, options?: {}): Promise<any> {
    this.logger.verbose(['read', JSON.stringify(Object.values(arguments))].join(' '))

    const composePath = await this._composeNameToPath(composeFile)
    const data = await this.storage.getDisk('stacks').getBuffer(composePath)

    // const compose = parse(data.content.toString())
    // const crate = compose.services.crate

    // return {
    //   crate,
    // }

    return {
      name: composePath,
      compose: parse(data.content.toString()),
      raw: data.content.toString(),
    }
  }

  private async _exec(command: string, parameters: any[] | {} = [], options?: PromisifySpawnOptions | SSHExecCommandOptions): Promise<ExecCommandResponse> {
    this.logger.verbose(['exec', JSON.stringify(Object.values(arguments))].join(' '))

    if (options?.cwd) {
      options.cwd = posix.join(this.rootStacksPath, options.cwd.toString())
    }


    switch (this.config.get<'ssh' | 'http' | 'https'>('dockerode.config.protocol')) {
      case 'ssh': {
        return await this.ssh.exec(command, this._convertToArgs(parameters), {
          encoding: 'utf-8',
          ...options as SSHExecCommandOptions,
          stream: 'both',
        })
      }

      default: {
        try {
          const exec = await spawn(command, this._convertToArgs(parameters), {
            encoding: os.platform() === 'win32' ? 'latin1' : 'utf-8',
            ...options as PromisifySpawnOptions,
          })

          if (exec.stderr || exec.code !== 0) {
            this.logger.error('Error executing command', exec.stderr)
            throw new RpcException('Error executing command: ' + exec.stderr)
          }

          return {
            stdout: exec.stdout?.toString(),
            stderr: exec.stderr?.toString(),
            code: exec.code,
            signal: exec.signal,
          }
        } catch (error) {
          this.logger.error('Error executing command', error.message, error.stack)
          throw new RpcException('Error executing command: ' + error.message)
        }
      }
    }
  }

  private async _composeNameToPath(composeFile: string, diskName = 'stacks'): Promise<string> {
    const disk = this.storage.getDisk(diskName)
    let composePath: string | undefined
    const possibleFiles = [
      'docker-compose.yml',
      'docker-compose.yaml',
      'compose.yml',
      'compose.yaml',
    ].map(file => posix.join(composeFile, file))

    if (!composeFile.endsWith('.yml') && !composeFile.endsWith('.yaml')) {
      for (const file of possibleFiles) {
        if ((await disk.exists(file)).exists) {
          composePath = file
          break
        }
      }
    } else if ((await disk.exists(composeFile)).exists) {
      composePath = composeFile
    }

    if (!composePath) {
      throw new Error(`Compose file not found in <${composePath || composeFile}> !`)
    }

    return composePath
  }

  private _convertToArgs(parameters: any[] | {}, prefix = ''): string[] {
    const args = []

    for (const key in parameters) {
      const value = parameters[key]

      switch (typeof value) {
        case 'boolean': {
          if (value) {
            args.push(`${prefix}${key}`)
          }
          break
        }

        case 'number':
        case 'string': {
          args.push(
            isNumber(parseInt(key))
              ? `${prefix}${value}`
              : `${prefix}${key}=${value}`
          )
          break
        }

        default: {
          if (Array.isArray(value)) {
            args.push(`${prefix}${key}=${value.join(',')}`)
          } else if (isObject(value)) {
            args.push(...this._convertToArgs(value, '--'))
          }
        }
      }
    }

    return args
  }
}
