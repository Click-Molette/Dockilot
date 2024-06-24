import { Injectable } from "@nestjs/common"
import { readFileSync } from "fs"
import { PackageJson } from "types-package-json"
import { pick } from "radash"

@Injectable()
export class AppService {
  private package: PackageJson

  public constructor() {
    try {
      this.package = JSON.parse(readFileSync('package.json', 'utf-8'))
    } catch (error) {
      //TODO: handle error
    }
  }

  public getInfos(): Partial<PackageJson> {
    return pick(this.package, ['name', 'version'])
  }
}
