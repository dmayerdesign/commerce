import { readdirSync, writeFileSync } from 'fs'
import { mkdirpSync } from 'fs-extra'
import { resolve } from 'path'
import { environment } from '../../../environment'

export default function main(): void {
  const buildEnv = environment().ENVIRONMENT
  const appConfig = require(`../../../app-config.${buildEnv.toLowerCase()}.json`)
  const destPath = resolve(__dirname, '../generated/config/app-config.generated.ts')
  const formatJsonValue = (value: any) => typeof value === 'string'
    ? `'${value}'`
    : value
  const configPatternForEntitiesDev = 'domains/**/*.ts' as string
  const configPatternForEntitiesProd = 'domains/**/*.js' as string
  const likelyEntities = readdirSync(resolve(__dirname, '../lib/domains'))

  let appConfigClass = `// THIS FILE IS GENERATED. Do not edit this file.
  export class AppConfig {${
      Object.keys(appConfig)
        .map((key) =>
          '\n  public static readonly ' + key + ' = ' + formatJsonValue(appConfig[key])
        )
        .join('')
    }
  }\n`

  if (appConfigClass.indexOf(configPatternForEntitiesDev) > -1) {
    appConfigClass = appConfigClass.replace(configPatternForEntitiesDev, 'domains/**/?(' +
      // Each entityName must be kebab-cased.
      likelyEntities.join('|') +
    ').ts')
  }

  if (appConfigClass.indexOf(configPatternForEntitiesProd) > -1) {
    appConfigClass = appConfigClass.replace(configPatternForEntitiesProd, 'domains/**/?(' +
      // Each entityName must be kebab-cased.
      likelyEntities.join('|') +
    ').js')
  }

  mkdirpSync(resolve(__dirname, '../generated/config'))
  writeFileSync(destPath, appConfigClass)
}
main()
