import { modelBuilder } from '../goosetype-model-builder'
import { ArrayPropOptions } from '../interfaces'

export function arrayProp(options: ArrayPropOptions): PropertyDecorator {
    return (target: any, key: string) => {
        modelBuilder.baseProp({ propType: 'array', target, key, options })
    }
}
