import { readFileSync, writeFileSync } from 'fs'
import { camelCase, upperFirst } from 'lodash'
import { resolve } from 'path'
import * as recursiveReaddir from 'recursive-readdir'

async function main(): Promise<void> {
  const libDirPath = resolve(__dirname, '../lib')
  const formatFilePath = (filePath: string): string => filePath.substring(libDirPath.length + 1, filePath.length - 3)
  const allPaths = await recursiveReaddir(libDirPath)
  const allPathsToTsModules = allPaths
    .filter((filePath) => !!filePath.match(/[^(index)]\.ts$/))
    .map((filePath) => formatFilePath(filePath))
    .sort((a, b) => a < b ? -1 : 1)
  let publicApiFile = ''

  for (const modulePath of allPathsToTsModules) {
    const filePath = `${libDirPath}/${modulePath}.ts`
    if (modulePath.indexOf('api/interfaces') > -1) {
      const interfaceName = upperFirst(camelCase(modulePath.substring(modulePath.lastIndexOf('/') + 1)))
      publicApiFile += `export { ${interfaceName} as I${interfaceName} } from './lib/${modulePath}'\n`
    }
    else if (
      modulePath.indexOf('api/entities') === -1 &&
      modulePath.indexOf('lib/constants') === -1
      // && modulePath.indexOf('lib/modules/http') === -1
      // && modulePath.indexOf('goosetype') === -1
    ) {
      const fileContents = readFileSync(filePath, { encoding: 'utf-8' }).toString()
      const fileContentsAfter = fileContents.split('export ')[1]
      let target: string

      if (
        (
          fileContentsAfter.indexOf('const') === 0
          && fileContentsAfter.indexOf('const enum') === -1
        ) ||
        fileContentsAfter.indexOf('class') === 0 ||
        fileContentsAfter.indexOf('enum') === 0 ||
        fileContentsAfter.indexOf('interface') === 0 ||
        fileContentsAfter.indexOf('type') === 0 ||
        fileContentsAfter.indexOf('function') === 0
      ) {
        target = fileContentsAfter.split(' ')[1]
      }

      if (
        fileContentsAfter.indexOf('const enum') === 0 ||
        fileContentsAfter.indexOf('abstract class') === 0
      ) {
        target = fileContentsAfter.split(' ')[2]
      }

      if (
        fileContentsAfter.indexOf('function') === 0 ||
        fileContentsAfter.indexOf('type') === 0 ||
        fileContentsAfter.indexOf('interface') === 0 ||
        fileContentsAfter.indexOf('abstract class') === 0 ||
        fileContentsAfter.indexOf('class') === 0
      ) {
        target = target.split('(')[0].split('<')[0]
      }

      if (fileContentsAfter.indexOf('{') === 0) {
        target = fileContentsAfter.substr(1).split(' ')[0]
      }

      publicApiFile += `export { ${target} } from './lib/${modulePath}'\n`
    }
  }
  writeFileSync(resolve(libDirPath, '../public_api.ts'), publicApiFile)
}

main()
