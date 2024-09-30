import { applyDecorators } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MessagePattern } from '@nestjs/microservices'

export function PrefixedMessagePattern(pattern: string | number) {
  // const configService = new ConfigService()
  // const prefix = configService.get<string>('APP_PREFIX')
  // const prefixedPattern = `${prefix}${pattern}`

  console.log('PrefixedMessagePattern', pattern)

  return applyDecorators(
    MessagePattern(pattern),
  );
}
