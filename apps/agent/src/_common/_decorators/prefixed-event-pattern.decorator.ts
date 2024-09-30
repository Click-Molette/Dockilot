import { ConfigService } from '@nestjs/config';
import { EventPattern } from '@nestjs/microservices'

export const PrefixedEventPattern = (event: string) => {
  return (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const configService = new ConfigService()
    console.log('configService', configService)
    const prefix = configService.get<string>('EVENT_PREFIX', 'default-prefix')
    EventPattern(`${prefix}:${event}`)(target, key, descriptor)
  }
}
