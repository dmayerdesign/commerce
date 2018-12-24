import { Document as MongooseDocument, Schema, SchemaTypeOpts } from 'mongoose'

export type Func = (...args: any[]) => any
export type RequiredType = boolean | [boolean, string] | string | Func | [Func, string]
export type PropType = 'array' | 'object'

export interface BasePropOptions extends SchemaTypeOpts<any> { }

export interface Document extends MongooseDocument {
    createdAt?: any
    updatedAt?: any
}

export interface PropOptions extends BasePropOptions { }

export interface ArrayPropOptions extends BasePropOptions {
    items?: any
    ref?: any
    refPath?: string
}

export interface SchemaTypeOptions extends PropOptions {
    type?: string | Function | Object | Schema.Types.ObjectId
}

export interface ValidateNumberOptions {
    min?: number | [number, string]
    max?: number | [number, string]
}

export interface ValidateStringOptions {
    minlength?: number | [number, string]
    maxlength?: number | [number, string]
    match?: RegExp | [RegExp, string]
}
