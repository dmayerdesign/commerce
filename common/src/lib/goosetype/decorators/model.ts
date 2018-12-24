import * as mongoose from 'mongoose'
import { composeModel } from '../helpers/compose-model'

export function model(schemaOptions?: mongoose.SchemaOptions): ClassDecorator {
    return function(ctor: any): any {
        composeModel(ctor.prototype, schemaOptions)
    }
}
