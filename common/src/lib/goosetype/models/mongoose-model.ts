import * as mongoose from 'mongoose'
import { ArrayPropOptions, IMongooseDocument, PropOptions, PropType } from '../interfaces'

export interface MongooseModel<T = any> extends mongoose.Model<T & IMongooseDocument> {
    findOrCreate: (query: object) => Promise<{ doc: T; created: boolean }>
}

export interface PropTypeArgs {
    options: PropOptions & ArrayPropOptions
    propType: PropType
    key: string
    target: MongooseModel<any>
}
