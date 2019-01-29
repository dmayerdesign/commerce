import { Entity } from '../data-access/entity.interface'

export interface Image extends Entity {
    large?: string
    medium?: string
    thumbnail?: string
}
