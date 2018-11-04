import { camelCase } from 'lodash'
import { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOpts } from 'mongoose'
import { PropTypeArgs } from './models/mongoose-model'

// Errors.

export class InvalidArrayPropOptionsError extends Error { }
export class SchemaNotDefinedError extends Error { }

// Model builder.

let modelBuilder: ModelBuilder // Create a singleton.

export class ModelBuilder {
    public schemaDefinitions: { [key: string]: SchemaDefinition } = {}
    public schemas: { [key: string]: Schema } = {}
    public preMiddleware: any = {}
    public postMiddleware: any = {}
    public plugins: any = {}

    constructor() {
        if (!modelBuilder) {
            modelBuilder = this
        }
        return modelBuilder
    }

    public findOrCreateSchema(name: string, schemaDefinition: SchemaDefinition, schemaOptions: SchemaOptions): Schema {
        let schema: Schema

        if (!modelBuilder.schemas[camelCase(name)]) {
            schema = new Schema(schemaDefinition, schemaOptions)
            modelBuilder.schemas[camelCase(name)] = schema
        } else {
            schema = modelBuilder.schemas[camelCase(name)]
            Object.keys(schemaDefinition).forEach((schemaKey) => {
                schema.add({ [schemaKey]: schemaDefinition[schemaKey] })
            })
        }

        // Allows getters to work.
        schema.set('toObject', { getters: true })
        schema.set('toJSON', { getters: true })

        // Prevents `MongoError: Unknown modifier: $pushAll` (see https://github.com/Automattic/mongoose/issues/5574)
        // TODO: remove once upgraded to mongoose v5.x
        schema.set('usePushEach', true)

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

    public isValidPrimitiveOrObject(type: any): boolean {
        return (
            Array.isArray(type) ||
            type === String ||
            type === Number ||
            type === Boolean ||
            type === Object ||
            type === Buffer
        )
    }

    public getTypeOrSchema(type: any, options?: SchemaOptions): object {
        if (this.isValidPrimitiveOrObject(type)) {
            if (type === Object) {
                return Schema.Types.Mixed
            }
            if (type === Buffer) {
                return Schema.Types.Buffer
            }
            return type
        }
        else {
            if (type === Schema.Types.ObjectId) {
                return Schema.Types.ObjectId
            }
            // If the prop is not a valid primitive or object, and it's not an ObjectId,
            // assume it's a custom schema. If the schema has yet to be defined, define it.
            // (This will probably only happen if you're using a schema class as the type
            // of one of its own properties.)
            return this.findOrCreateSchema(camelCase(type.name), this.schemaDefinitions[camelCase(type.name)], options)
        }
    }

    public baseProp(propTypeArgs: PropTypeArgs): void {
        const { target, key, propType, options } = propTypeArgs
        let schemaDefinition: SchemaDefinition = this.schemaDefinitions[camelCase(target.constructor.name)]
        let schemaProperty: SchemaTypeOpts<any> = {}
        let type: any

        const nonPropertyOptions = [
            'itemsType',
            'itemsRef',
            'itemsRefPath'
        ]

        if (!schemaDefinition) {
            schemaDefinition = this.schemaDefinitions[camelCase(target.constructor.name)] = {}
        }

        // Might need a second glance.
        if (options) {
            Object.keys(options)
                .filter((option) => nonPropertyOptions.indexOf(option) === -1)
                .forEach((option) => {
                    if (option === 'enum') {
                        const theEnum = options[option]
                        let enumArr: string[] = []
                        let enumKeys: string[]
                        if (Array.isArray(theEnum)) {
                            enumArr = theEnum as string[]
                        }
                        // If the enum value is not an array, assume it's an actual `enum`.
                        else {
                            enumKeys = Object.keys(theEnum)
                            enumArr = !isNaN(parseInt(enumKeys[0], 10))
                                ? enumKeys.slice(0, enumKeys.length / 2)
                                : enumKeys.map((enumKey) => theEnum[enumKey])
                        }
                        schemaProperty.enum = enumArr
                    }
                    else {
                        schemaProperty[option] = options[option]
                    }
                })
        }

        if (propType === 'array') {
            if (options) {
                if (!options.itemsType && !options.itemsRef && !options.itemsRefPath) {
                    throw new InvalidArrayPropOptionsError('You must define itemsType, itemsRef, or itemsRefPath.')
                }

                if (options.itemsType) {
                    schemaProperty.type = [ this.getTypeOrSchema(options.itemsType) ]
                }
                else if (options.itemsRef) {
                    schemaProperty = [{
                        type: Schema.Types.ObjectId,
                        ref: options.itemsRef.name,
                        ...schemaProperty,
                    }]
                }
                else if (options.itemsRefPath) {
                    schemaProperty = [{
                        type: Schema.Types.ObjectId,
                        refPath: options.itemsRefPath,
                        ...schemaProperty,
                    }]
                }
            }
        }
        else {
            type = Reflect.getMetadata('design:type', target, key)

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
            }

            schemaProperty.type = this.getTypeOrSchema(type)
        }

        schemaDefinition[key] = schemaProperty
    }
}

modelBuilder = new ModelBuilder()
export { modelBuilder }
