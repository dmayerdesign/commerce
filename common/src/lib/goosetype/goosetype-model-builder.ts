import { camelCase } from 'lodash'
import { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOpts } from 'mongoose'
import 'reflect-metadata'
import { PropTypeArgs } from './models/mongoose-model'

// Errors.

export class InvalidArrayPropOptionsError extends Error { }
export class SchemaNotDefinedError extends Error { }

// Model builder.

let modelBuilder: ModelBuilder // Declare a global singleton.

export class ModelBuilder {
    public schemas = new Map<string, Schema>()
    public preMiddleware = new Map<any, any>()
    public postMiddleware = new Map<any, any>()
    public plugins = new Map<any, any>()

    constructor() {
        return modelBuilder || (modelBuilder = this)
    }

    public schema(name: string, schemaDefinition?: SchemaDefinition, schemaOptions?: SchemaOptions): Schema {
        let schema: Schema
        const schemaName = camelCase(name)

        if (!this.schemas.get(schemaName)) {
console.log('NEW SCHEMA', schemaDefinition)
            schema = new Schema(schemaDefinition, schemaOptions)
        }

        if (schemaDefinition) {
            if (!this.schemas.get(schemaName)) {
                this.schemas.set(schemaName, schema)
            }
            else {
                schema = this.schemas.get(schemaName)
                Object.keys(schemaDefinition).forEach((schemaKey) => {
                    schema.path(schemaKey, schemaDefinition[schemaKey])
                })
console.log('EXISTING SCHEMA', schemaDefinition)
            }

            // Allow getters to work.
            schema.set('toObject', { getters: true })
            schema.set('toJSON', { getters: true })

            // Prevent `MongoError: Unknown modifier: $pushAll` (see https://github.com/Automattic/mongoose/issues/5574)
            // TODO: remove once upgraded to mongoose v5.x
            schema.set('usePushEach', true)
        }

        return schema
    }

    public addTo(which: string, constructorName: string, value: any): void {
        let definition = this[which][camelCase(constructorName)]
        if (!definition) {
            definition = []
        }
        definition.push(value)
        this[which][camelCase(constructorName)] = definition
    }

    public baseProp(propTypeArgs: PropTypeArgs): void {
        const { target, key, propType, options } = propTypeArgs
        const name = camelCase(target.constructor.name)
        const schemaProperty: SchemaTypeOpts<any> = {}
        let type: any

        if (options) {
            Object.keys(options)
                .map((optionKey) => [ optionKey, options[optionKey] ])
                .forEach(([ optionKey, option ]) => {
                    if (optionKey === 'enum') {
                        const originalEnum = option
                        let enumArr: string[] = []
                        let enumKeys: string[]
                        if (Array.isArray(originalEnum)) {
                            enumArr = originalEnum as string[]
                        }
                        // If the enum value is not an array, assume it's an actual `enum`.
                        else {
                            enumKeys = Object.keys(originalEnum)
                            enumArr = !isNaN(parseInt(enumKeys[0], 10))
                                ? enumKeys.slice(0, enumKeys.length / 2)
                                : enumKeys.map((enumKey) => originalEnum[enumKey])
                        }
                        schemaProperty.enum = enumArr
                    }
                    else {
                        schemaProperty[option] = option
                    }
                })
        }

        if (propType === 'array') {
            if (!options ||
                (
                    !options.type &&
                    !options.ref &&
                    !options.refPath
                )
            ) {
                throw new InvalidArrayPropOptionsError(
                    `You must define type, ref, or refPath for array prop "${key}".`
                )
            }
        }
        else {
            type = Reflect.getMetadata('design:type', target, key)
        }

        if (options) {
            if (options.type) {
                type = options.type
            }
            if (options.ref) {
                let ref = options.ref
                if (typeof options.ref !== 'string') {
                    ref = ref.name
                }
                schemaProperty.ref = ref
                type = Schema.Types.ObjectId
            }
            if (options.refPath) {
                schemaProperty.refPath = options.refPath
                type = Schema.Types.ObjectId
            }
        }

        schemaProperty.type = this._getTypeOrSchema(type)

        this.schema(name, { [key]: schemaProperty })
    }

    private _getTypeOrSchema(type: any): object {
        if (this._isValidPrimitiveOrObject(type)) {
            if (type === Object) {
                return Schema.Types.Mixed
            }
            if (type === Buffer) {
                return Schema.Types.Buffer
            }
console.log('was valid primitive or object', type)
            return type
        }
        else {
            const typeName = camelCase(type.name)
            if (type === Schema.Types.ObjectId) {
console.log('was an objectid', type)
                return Schema.Types.ObjectId
            }
            // If the prop is not a valid primitive or object, and it's not an ObjectId,
            // assume it's a custom schema.
console.log('was something else', type)
            return this.schema(typeName)
        }
    }

    private _isValidPrimitiveOrObject(type: any): boolean {
        return (
            Array.isArray(type) ||
            type === String ||
            type === Number ||
            type === Boolean ||
            type === Object ||
            type === Buffer
        )
    }
}

modelBuilder = new ModelBuilder()

export { modelBuilder }
