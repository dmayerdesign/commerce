import { MongooseDocument } from './mongoose-document'

export interface Timer extends MongooseDocument {
    name: string
    url: string
    method: string
    startedAt: number
    duration: number
    jsonData: string
}
