import { Model } from 'mongoose'

export interface PopulateOptions {
    path: string
    model?: Model<any>
    populate?: PopulateOptions | string
    select?: string
}
