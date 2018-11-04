import { writeFileSync } from 'fs'
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
  allPathsToTsModules.forEach((filePath) => {
    if (filePath.indexOf('api/interfaces') > -1) {
      const interfaceName = upperFirst(camelCase(filePath.substring(filePath.lastIndexOf('/') + 1)))
      publicApiFile += `export { ${interfaceName} as I${interfaceName} } from './lib/${filePath}'\n`
    } else {
      publicApiFile += `export * from './lib/${filePath}'\n`
    }
  })
  writeFileSync(resolve(libDirPath, '../public_api.ts'), publicApiFile)
}

main()
