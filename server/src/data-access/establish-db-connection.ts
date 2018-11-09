import * as mongoose from 'mongoose'
import { isDev } from '../helpers/env.helper'

(mongoose as any).Promise = global.Promise
if (isDev()) mongoose.set('debug', true)

// I believe this is technically a `MongooseThenable`, not an actual Promise.
export async function establishDbConnection(databaseUri?: string): Promise<mongoose.Connection> {
    await mongoose.connect(databaseUri || process.env.MONGODB_URI, {
        autoIndex: isDev() ? true : false,
    } as any)
    return mongoose.connection
}
