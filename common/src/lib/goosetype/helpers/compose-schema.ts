import { camelCase } from 'lodash'
import * as mongoose from 'mongoose'
import { modelBuilder } from '../goosetype-model-builder'
import { MongooseDocument } from '../models/mongoose-document'

export function composeSchema<T>(target: MongooseDocument, schemaOptions?: mongoose.SchemaOptions): mongoose.Schema {
    const name = camelCase(target.constructor.name)
    const schemaDefinition = modelBuilder.schemaDefinitions.get(name)
    const schema = modelBuilder.findOrCreateSchema(name, schemaDefinition, schemaOptions)
    const preMiddleware = modelBuilder.preMiddleware.get(name)
    const postMiddleware = modelBuilder.postMiddleware.get(name)
    const plugins = modelBuilder.plugins.get(name)

    if (preMiddleware) {
        preMiddleware.forEach((preHookArgs) => {
            if (preHookArgs.length > 1) {
                preHookArgs.forEach((arg) => {
                    if (typeof arg === 'function') {
                        arg = arg.bind(schema)
                    }
                });
                (schema.pre as any)(...preHookArgs)
            }
            else {
                throw new Error(`Invalid number of preMiddleware arguments: got ${preHookArgs.length}, expected 2 or more`)
            }
        })
    }

    if (postMiddleware) {
        postMiddleware.forEach((postHookArgs) => {
            if (postHookArgs.length > 1) {
                (schema.post as any)(...postHookArgs)
            }
            else {
                throw new Error(`Invalid number of postMiddleware arguments: got ${postHookArgs.length}, expected 2 or more`)
            }
        })
    }

    if (plugins) {
        plugins.forEach((plugin) => {
            schema.plugin(plugin[0] as (schema: mongoose.Schema, options?: Object) => void, plugin[1] as Object)
        })
    }

    (target.constructor as typeof MongooseDocument).__schema = schema

    return schema
}
