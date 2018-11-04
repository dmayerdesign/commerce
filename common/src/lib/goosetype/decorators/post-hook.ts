import { modelBuilder } from '../goosetype-model-builder'

export function post<T>(method: string, fn: (...args: any[]) => void): ClassDecorator {
    return function(constructor: any): void {
        modelBuilder.addTo('postMiddleware', constructor.name, [ method, fn ])
    }
}
