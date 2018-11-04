import { MongooseDocument } from './mongoose-document'
import { Ref } from './ref'
import { User } from './user'

export interface LinkEmbed extends MongooseDocument {
    url: string
    type: string
    thumbnail_url: string
    title: string
    description: string
    provider_url: string
}

export interface Author extends MongooseDocument {
    userId: string
    firstName: string
    lastName: string
}

export interface Reactions extends MongooseDocument {
    up: Ref<User>[]
    down: Ref<User>[]
}

export interface Comment extends MongooseDocument {
    author: Author
    content: string
    images: string[]
    linkEmbed: LinkEmbed
    reactions: Reactions
}

export interface Post extends MongooseDocument {
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
