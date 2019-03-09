export function Memoized(
  _target: any,
  _propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>
) {
  const cache = {}
  const originalMethod = descriptor.value as Function

  function stringifyArgs(args: any[]): string {
    let stringified = ''
    args.forEach((arg) => {
      if (typeof arg === 'function') {
        stringified += arg.toString()
      } else if (typeof arg !== 'undefined') {
        stringified += JSON.stringify(arg)
      }
    })
    return stringified
  }

  descriptor.value = function(...args: any[]): Function {
    const stringifiedArgs = stringifyArgs(args)

    if (cache[stringifiedArgs]) {
      return cache[stringifiedArgs]
    }

    return cache[stringifiedArgs] = originalMethod.call(this, ...args)
  }
}
