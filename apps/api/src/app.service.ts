import { Injectable } from '@nestjs/common'
import { readFileSync } from 'node:fs'
import { PackageJson } from 'types-package-json'
import { pick } from 'radash'

@Injectable()
export class AppService {
  private _package: PackageJson

  public constructor() {
    try {
      this._package = JSON.parse(readFileSync('package.json', 'utf-8'))
    } catch (error) {
      //TODO: handle error
    }
  }

  /**
   * Get infos about the app
   *
   * @returns Partial<PackageJson>
   */
  public getInfos(): Partial<PackageJson> {
    return pick(this._package, ['name', 'version'])
  }
}
