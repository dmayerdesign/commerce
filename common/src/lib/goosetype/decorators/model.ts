import * as mongoose from 'mongoose'
import { composeModel } from '../helpers/compose-model'
import { MongooseDocument } from '../models/mongoose-document'

export function model(ctorRef: typeof MongooseDocument & any, schemaOptions?: mongoose.SchemaOptions): ClassDecorator {
    const target = new ctorRef()
    setTimeout(() => composeModel(target, schemaOptions))
    return function(ctor: typeof ctorRef): any {
        return ctor
    }
}
