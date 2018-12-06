import { Document } from './document'

export interface Timer extends Document {
    name: string
    url: string
    method: string
    startedAt: number
    duration: number
    jsonData: string
}
