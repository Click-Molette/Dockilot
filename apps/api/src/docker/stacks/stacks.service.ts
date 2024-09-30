import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { EventPatterns } from '@the-software-compagny/dockilot_shared-types'
import { lastValueFrom } from 'rxjs'
import { observableTimeoutCatch } from '~/_common/_functions/observable-timeout-catch.function'

@Injectable()
export class StacksService implements OnModuleInit {
  protected readonly logger = new Logger(StacksService.name)

  public constructor(@Inject('docker') private readonly _client: ClientProxy) {
  }

  public async onModuleInit(): Promise<void> {
    try {
      const res = await this._client.connect()
    } catch (err) {
      console.error('err', err)
    }
  }

  public async search(options?: { filters?: { [key: string]: string[] } }): Promise<any> {
    this.logger.debug(['search', JSON.stringify(Object.values(arguments))].join(' '))

    const search$ = this._client.send<any>(EventPatterns.STACKS_SEARCH, { options })
    const data = await lastValueFrom(observableTimeoutCatch(search$))

    return [data, data.length]
  }

  public async read(name: string, options?: {}): Promise<any> {
    this.logger.debug(['read', JSON.stringify(Object.values(arguments))].join(' '))

    const read$ = this._client.send<any>(EventPatterns.STACKS_READ, { name, options })

    return await lastValueFrom(observableTimeoutCatch(read$))
  }
}
