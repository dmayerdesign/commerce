import { writeFileSync } from 'fs'
import { mkdirpSync } from 'fs-extra'
import { resolve } from 'path'
import * as sassExtract from 'sass-extract'
import { destExistsOrUserAcceptsMkdirp } from './pre-generate'

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

  if (await destExistsOrUserAcceptsMkdirp(destDir)) {
    mkdirpSync(destDir)
    writeFileSync(
      destPath,
      `// tslint:disable
  const $styles = ${JSON.stringify(variables, null, 2)}
  export const styles = $styles.global
  `
    )
  }
}
main()
