import { modelBuilder } from '../goosetype-model-builder'
import { PropOptions } from '../interfaces'

export function prop(options?: PropOptions): PropertyDecorator {
    return (target: any, key: string) => {
        modelBuilder.baseProp({ propType: 'object', target, key, options })
    }
}
