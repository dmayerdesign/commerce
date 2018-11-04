import { writeFileSync } from 'fs'
import { extname, resolve } from 'path'
import * as recursiveReaddir from 'recursive-readdir'

async function main(): Promise<void> {
  const libDirPath = resolve(__dirname, '../lib')
  const ignoreFn = (filePath: string): boolean => {
    console.log(filePath)
    return extname(filePath).toLowerCase() !== 'ts'
  }
  const formatFilePath = (filePath: string): string => filePath.substring(libDirPath.length + 1)
  const allPathsToTsModules = await recursiveReaddir(libDirPath, [ignoreFn])
  let publicApiFile = ''
  allPathsToTsModules.forEach((filePath) => {
    publicApiFile += `export * from ./${formatFilePath(filePath)}\n`
  })
  console.log(publicApiFile)
  writeFileSync(resolve(libDirPath, '../public_api.ts'), publicApiFile)
}

main()
