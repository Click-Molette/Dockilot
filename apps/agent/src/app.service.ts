import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { readFileSync } from 'node:fs'
import { PackageJson } from 'types-package-json'

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly package: Partial<PackageJson>
  protected readonly logger: Logger = new Logger(AppService.name)

  public constructor() {
    this.package = JSON.parse(readFileSync('package.json', 'utf-8'))
  }

  public onApplicationBootstrap() {
    this.logger.log(`Dockilot Agent now listening with version <${this.package.version}> 🕹️`)
  }
}
