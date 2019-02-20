import { parse } from 'dotenv'
import { readFileSync, writeFileSync } from 'fs-extra'
import { resolve } from 'path'

export default function main(): void {
  let envString = `ENVIRONMENT_VARS=`
  const destPath = resolve(__dirname, '../../../.env')
  const variablesBuffer = readFileSync(resolve(__dirname, '../../../.variables'))
  const variablesObj = parse(variablesBuffer)

  envString += encodeURIComponent(JSON.stringify(variablesObj))
  envString += '\n'

  writeFileSync(destPath, envString)
}
main()
