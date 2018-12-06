import * as mongoose from 'mongoose'
import { composeSchema } from '../helpers/compose-schema'

export function schema(schemaOptions?: mongoose.SchemaOptions): ClassDecorator {
    return function(ctor: any): any {
        const target = new ctor()
        composeSchema(target, schemaOptions)
        return ctor
    }
}

