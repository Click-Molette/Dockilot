import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { readFileSync } from 'node:fs'
import { pick } from 'radash'
import { PackageJson } from 'types-package-json'
import chalk from 'chalk'

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly package: Partial<PackageJson>
  protected readonly logger: Logger = new Logger(chalk.bold.cyan(AppService.name) + '\x1b[33m')

  public constructor() {
    try {
      this.package = JSON.parse(readFileSync('package.json', 'utf-8'))
    } catch (error) {
      //TODO: handle error
    }
  }

  public onApplicationBootstrap() {
    this.logger.log(chalk.bold.blue(`Dockilot Agent now listening with version <${this.package.version}> 🕹️`))
  }

  public getInfos(): Partial<PackageJson> {
    return pick(this.package, ['name', 'version'])
  }
}
