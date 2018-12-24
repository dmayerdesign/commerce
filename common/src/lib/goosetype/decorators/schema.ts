import * as mongoose from 'mongoose'
import { composeSchema } from '../helpers/compose-schema'

export function schema(schemaOptions?: mongoose.SchemaOptions): ClassDecorator {
    return function(ctor: any): any {
        composeSchema(ctor.prototype, schemaOptions)
    }
}

