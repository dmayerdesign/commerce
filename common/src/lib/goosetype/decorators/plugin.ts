import { Schema } from 'mongoose'
import { modelBuilder } from '../goosetype-model-builder'

export function plugin(_plugin: (schema: Schema, options?: object) => void, options?: object): ClassDecorator {
    return (constructor: any) => {
        modelBuilder.addTo('plugins', constructor.name, [ plugin, options ])
    }
}
