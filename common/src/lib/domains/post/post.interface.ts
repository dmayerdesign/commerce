import { Entity } from '../data-access/entity.interface'
import { Image } from '../image/image.interface'
import { User } from '../user/user.interface'

export interface LinkEmbed {
    url: string
    type: string
    thumbnail_url: string
    title: string
    description: string
    provider_url: string
}

export interface Author {
    userId: string
    firstName: string
    lastName: string
}

export interface Reactions {
    up: User[]
    down: User[]
}

export interface Comment {
    author: Author
    content: string
    images: Image[]
    linkEmbed: LinkEmbed
    reactions: Reactions
}

export interface Post extends Entity {
    author: Author
    type: string
    content: Author
    eventDate: Date
    eventLocation: string
    tags: string[]
    images: Image[]
    linkEmbed: LinkEmbed
    comments: Comment[]
    reactions: Reactions
}
