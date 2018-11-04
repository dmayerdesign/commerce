import { NativeError } from 'mongoose'
import { modelBuilder } from '../goosetype-model-builder'

export function pre(method: string, ...args: any[]): ClassDecorator {
    return function(constructor: any): void {
        let parallel = false
        let fn: (next: (err?: NativeError) => void, done: () => void) => void
        if (typeof args[0] === 'boolean') {
            parallel = args[0]
            fn = args[1]
        } else {
            fn = args[0]
        }
        modelBuilder.addTo('preMiddleware', constructor.name, [ method, parallel, fn ])
    }
}
