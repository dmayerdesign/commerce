export function Memoize<ArgsType extends any[], ReturnType>(
  _target: any,
  _propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: ArgsType) => ReturnType>
) {
  const method = descriptor.value as (...args: ArgsType) => ReturnType
  const cache = new Map<string, ReturnType>()
  descriptor.value = function(...args: ArgsType): ReturnType {
    const argsKey = JSON.stringify(args)
    return cache.get(argsKey) ||
      cache.set(argsKey, method.call(this, ...args))
        .get(argsKey) as ReturnType
  }
}
