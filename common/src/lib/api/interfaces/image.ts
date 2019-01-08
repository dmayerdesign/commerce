import { Entity } from './entity'

export interface Image extends Entity {
    large?: string
    medium?: string
    thumbnail?: string
}
