import { Model } from 'mongoose'

export interface IPopulateOptions {
    path: string
    model?: Model<any>
    populate?: PopulateOptions | string
    select?: string
}

export type PopulateOptions = string | IPopulateOptions
