import { existsSync, writeFileSync } from 'fs'
import { mkdirpSync } from 'fs-extra'
import { singularize } from 'inflection'
import { kebabCase, upperFirst } from 'lodash'
import { resolve } from 'path'
import * as apiEndpoints from '../lib/constants/api-endpoints'
import { endpointsBlacklist } from './endpoints-blacklist'

async function main(): Promise<void> {
  const baseImportsForModule = `// THIS FILE IS GENERATED. Do not edit this file.
import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
`
  const baseImportsForController1 = `// THIS FILE IS GENERATED. Do not edit this file.
import { Controller as NestController, Inject } from '@nestjs/common'\n`
  const baseImportsForController2 = `import { Controller } from '../../shared/controller/controller'\n`
  const pathToServerSrc = '../../../server/src'
  const pathToDomains = `${pathToServerSrc}/domains`
  let barrelImports = ``
  let barrelBody = `export const domainModules = [`
  const makeSortable = (str: string) => singularize(str)

  const endpointNames = Object.keys(apiEndpoints)
    .filter((endpointName) => endpointsBlacklist.indexOf(endpointName) === -1)
    .sort((a, b) =>
      makeSortable(a) < makeSortable(b)
        ? -1
        : makeSortable(a) > makeSortable(b)
        ? 1
        : 0
    )

  const entityNames = endpointNames.map((endpointName) => upperFirst(singularize(endpointName)))

  endpointNames
    .forEach((endpointName) => {
      const entityName = upperFirst(singularize(endpointName))
      const entityNameKebab = kebabCase(singularize(endpointName))
      const hasCustomController = existsSync(
        resolve(__dirname, `${pathToDomains}/${entityNameKebab}/${entityNameKebab}.controller.ts`),
      )

      let entityImportsForController1 =
`import { ${entityName} } from '@qb/common/domains/${entityNameKebab}/${entityNameKebab}'\n`
      if (!hasCustomController) {
        entityImportsForController1 +=
`import { ${endpointName} } from '@qb/common/constants/api-endpoints'\n`
      }
      const entityImportsForController2 =
`import { ${entityName}Repository } from './${entityNameKebab}.repository.generated'\n`
      let bodyForController = '\n'
      let customBaseImportsForController1 = ''

      if (!hasCustomController) {
        bodyForController += `@NestController(${endpointName})\n`
      } else {
        customBaseImportsForController1 = `// THIS FILE IS GENERATED. Do not edit this file.
import { Inject } from '@nestjs/common'\n`
      }
      bodyForController +=
`export class ${entityName}Controller extends Controller<${entityName}> {
  constructor(
    @Inject(${entityName}Repository)
    protected readonly _repository: ${entityName}Repository
  ) { super() }
}
`

      let entityImportsForModule =
`import { ${entityName} } from '@qb/common/domains/${entityNameKebab}/${entityNameKebab}'`
      if (hasCustomController) {
        entityImportsForModule += `
import { ${entityName}Controller } from './${entityNameKebab}.controller'`
      } else {
        entityImportsForModule += `
import { ${entityName}Controller } from './${entityNameKebab}.controller.generated'`
      }
      entityImportsForModule += `
import { ${entityName}Repository } from './${entityNameKebab}.repository.generated'
${(entityNames
  .filter((_entityName) => _entityName !== entityName)
  .map((_entityName) =>
    'import { ' + _entityName + 'Module } from \'../' + kebabCase(_entityName) + '/' + kebabCase(_entityName) + '.module.generated\''
  ).join('\n'))}`

      const bodyForModule = `

@Module({
  imports: [
${
    (entityNames
      .filter((_entityName) => _entityName !== entityName)
      .map((_entityName) =>
        '    forwardRef(() => ' + _entityName + 'Module),'
      )
      .join('\n')
    )}
    TypeOrmModule.forFeature([ ${entityName} ]),
  ],
  providers: [ ${entityName}Repository ],
  controllers: [ ${entityName}Controller ],
  exports: [ ${entityName}Repository ],
})
export class ${entityName}Module { }
`

      barrelImports += `import { ${entityName}Module } from './domains/${entityNameKebab}/${entityNameKebab}.module.generated'\n`
      barrelBody += `
  ${entityName}Module,`

      mkdirpSync(resolve(__dirname, `${pathToDomains}/${entityNameKebab}`))
      writeFileSync(
        resolve(__dirname, `${pathToDomains}/${entityNameKebab}/${entityNameKebab}.module.generated.ts`),
        baseImportsForModule + entityImportsForModule + bodyForModule
      )
      writeFileSync(
        resolve(__dirname, `${pathToDomains}/${entityNameKebab}/${entityNameKebab}.controller.generated.ts`),
        (customBaseImportsForController1 || baseImportsForController1) +
        entityImportsForController1 +
        baseImportsForController2 +
        entityImportsForController2 +
        bodyForController
      )
    })

    barrelBody += `
]\n`
    writeFileSync(
      resolve(__dirname, `${pathToServerSrc}/domain-modules.generated.ts`),
      barrelImports + '\n' + barrelBody
    )
}
main()
