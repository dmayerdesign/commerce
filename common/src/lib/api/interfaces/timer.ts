import { Entity } from './entity'

export interface Timer extends Entity {
    name: string
    url: string
    method: string
    startedAt: number
    duration: number
    jsonData: string
}
