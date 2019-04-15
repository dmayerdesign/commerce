import { writeFileSync } from 'fs'
import { mkdirpSync } from 'fs-extra'
import { camelCase } from 'lodash'
import { resolve } from 'path'
import * as sassExtract from 'sass-extract'
import { destExistsOrUserAcceptsMkdirp } from './pre-generate'

function _mapVariablesToCamelCase(sassVarsObject: any): any {
  const camelCasedVarsObject = {} as any
  Object.keys(sassVarsObject).forEach((key) => {
    camelCasedVarsObject[camelCase(key.substring(1))] = sassVarsObject[key]
  })
  return camelCasedVarsObject
}

export default async function main(): Promise<void> {
  const resolvedRoot = resolve(__dirname, '../../../')
  const resolvedSrcFilePaths = [
      'ui/web/src/styles/variables.scss'
    ]
    .map((filePath) => resolve(resolvedRoot, filePath))

  const destDir = resolve(__dirname, '../generated/ui')
  const destPath = resolve(destDir, 'style-variables.generated.ts')

  let variables = Object.create({})

  resolvedSrcFilePaths.forEach((srcFilePath) => {
    const { vars } = sassExtract.renderSync({ file: srcFilePath })
    variables = { ...variables, ...vars }
  })

  const camelCasedVariables = _mapVariablesToCamelCase(variables.global)

  if (await destExistsOrUserAcceptsMkdirp(destDir)) {
    mkdirpSync(destDir)
    writeFileSync(
      destPath,
      `// tslint:disable
export const styles = ${JSON.stringify(camelCasedVariables, null, 2)}
`
    )
  }
}
main()
