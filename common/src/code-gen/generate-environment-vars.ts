import { parse } from 'dotenv'
import { readFileSync, writeFileSync } from 'fs-extra'
import { resolve } from 'path'
import { destExistsOrUserAcceptsMkdirp } from './pre-generate'

export default async function main(): Promise<void> {
  let envString = `ENVIRONMENT_VARS=`
  const destPath = resolve(process.env.QB_PATH_TO_SECRETS as string, '.env')
  console.log('destPath:', destPath)
  const variablesBuffer = readFileSync(
    resolve(process.env.QB_PATH_TO_SECRETS as string, '.variables')
  )
  console.log('variablesBuffer:', variablesBuffer)
  const variablesObj = parse(variablesBuffer)

  envString += encodeURIComponent(JSON.stringify(variablesObj))
  envString += '\n'

  if (await destExistsOrUserAcceptsMkdirp(destPath)) {
    writeFileSync(destPath, envString)
  }
}
main()
