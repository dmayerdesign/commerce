import { existsSync, PathLike } from 'fs'
import * as prompt from 'prompt'

export async function destExistsOrUserAcceptsMkdirp(destDir: PathLike): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const schema = {
      properties: {
        proceed: {
          pattern: /^(y|n)$/,
          message: `You are about to create ${destDir}. Proceed? [y/n]`,
          required: true,
        }
      }
    }
    prompt.start()

    if (!existsSync(destDir)) {
      prompt.get(schema, (err: Error, { proceed }) => {
        if (proceed === 'y') {
          resolve(true)
          return
        }
        resolve(false)
      })
    }
    else {
      resolve(true)
    }
  })
}
