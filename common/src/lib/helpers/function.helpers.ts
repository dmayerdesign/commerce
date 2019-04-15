export function Memoized(
  _target: any,
  _propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>
): void {
  const cache = {}
  const originalMethod = descriptor.value as Function

  function stringifyArgs(args: any[]): string {
    let stringified = ''
    for (const arg of args) {
      if (typeof arg === 'function') {
        stringified += arg.toString()
      } else {
        stringified += JSON.stringify(arg)
      }
    }
    return stringified
  }

  descriptor.value = function(...args: any[]): Function {
    const stringifiedArgs = stringifyArgs(args)

    if (stringifiedArgs.length > 50) {
      console.warn(
        'Using @Memoized with functions that take large (or many) arguments can be ' +
        'detrimental to performance.', args
      )
    }

    if (cache[stringifiedArgs]) {
      return cache[stringifiedArgs]
    }

    return cache[stringifiedArgs] = originalMethod.call(this, ...args)
  }
}
