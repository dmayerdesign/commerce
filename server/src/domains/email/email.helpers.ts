import { resolve } from 'path'
import * as pug from 'pug'

export function getPugCompileTemplateForEmail(filename: string): pug.compileTemplate {
  let _filename = filename
  if (_filename.endsWith('.pug')) {
    _filename = _filename.substr(0, _filename.indexOf('.pug'))
  }
  return pug.compileFile(
    resolve(__dirname, `./emails/templates/${_filename}.pug`),
  )
}
