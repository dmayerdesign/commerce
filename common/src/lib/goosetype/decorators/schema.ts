import * as mongoose from 'mongoose'
import { composeSchema } from '../helpers/compose-schema'
import { MongooseDocument } from '../models/mongoose-document'

export function schema(ctorRef: typeof MongooseDocument & any, schemaOptions?: mongoose.SchemaOptions): ClassDecorator {
    const target = new ctorRef()
    setTimeout(() => composeSchema(target, schemaOptions))
    return function(ctor: typeof ctorRef): any {
        return ctor
    }
}

