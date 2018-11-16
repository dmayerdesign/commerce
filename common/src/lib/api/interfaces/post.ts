import { Document } from '@qb/common/goosetype/interfaces'
import { Ref } from './ref'
import { User } from './user'

export interface LinkEmbed extends Document {
    url: string
    type: string
    thumbnail_url: string
    title: string
    description: string
    provider_url: string
}

export interface Author extends Document {
    userId: string
    firstName: string
    lastName: string
}

export interface Reactions extends Document {
    up: Ref<User>[]
    down: Ref<User>[]
}

export interface Comment extends Document {
    author: Author
    content: string
    images: string[]
    linkEmbed: LinkEmbed
    reactions: Reactions
}

export interface Post extends Document {
    author: Author
    type: string
    content: Author
    eventDate: Date
    eventLocation: string
    tags: string[]
    images: string[]
    linkEmbed: LinkEmbed
    comments: Comment[]
    reactions: Reactions
}
