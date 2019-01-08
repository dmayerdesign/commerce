import { writeFileSync } from 'fs'
import { singularize } from 'inflection'
import { kebabCase, upperFirst } from 'lodash'
import { resolve } from 'path'
import * as apiEndpoints from '../lib/constants/api-endpoints'

const endpointsBlacklist = [
  'instagramPosts',
]

async function main(): Promise<void> {
  const baseImports = `// THIS FILE IS GENERATED. Do not edit this file.
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from './data.service'
`

  let entityImports = `\n`
  let constantsImports = `\n`
  let body = ``

  Object.keys(apiEndpoints)
    .filter((endpointName) => endpointsBlacklist.indexOf(endpointName) === -1)
    .forEach((endpointName) => {
      const entityName = upperFirst(singularize(endpointName))
      const entityNameKebab = kebabCase(singularize(endpointName))

      entityImports +=
`import { ${entityName} } from '../../api/entities/${entityNameKebab}'\n`
      constantsImports +=
`import { ${endpointName} } from '../../constants/api-endpoints'\n`

      body += `
@Injectable({ providedIn: 'root' })
export class ${entityName}DataService extends DataService<${entityName}> {
  public readonly baseEndpoint = ${endpointName}
  constructor(protected readonly _httpClient: HttpClient) { super() }
}
`
    })

  writeFileSync(resolve(__dirname, '../lib/modules/data/data-services.ts'),
    baseImports + entityImports + constantsImports + body
  )
}
main()