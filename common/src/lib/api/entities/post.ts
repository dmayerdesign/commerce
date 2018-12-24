import { arrayProp, model, prop, schema, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { User } from './user'

@schema()
export class LinkEmbed {
    @prop() public url: string
    @prop() public type: string
    @prop() public thumbnail_url: string
    @prop() public title: string
    @prop() public description: string
    @prop() public provider_url: string
}

@schema()
export class Author {
    @prop() public userId: string
    @prop() public firstName: string
    @prop() public lastName: string
}

@schema()
export class Reactions {
    @arrayProp({ ref: User }) public up: Ref<User>[]
    @arrayProp({ ref: User }) public down: Ref<User>[]
}

@model(MongooseSchemaOptions.timestamped)
export class Comment extends MongooseDocument {
    @prop() public author: Author
    @prop() public content: string
    @arrayProp({ type: String }) public images: string[]
    @prop() public linkEmbed: LinkEmbed
    @prop() public reactions: Reactions
}

@model(MongooseSchemaOptions.timestamped)
export class Post extends MongooseDocument {
    @prop() public author: Author
    @prop({ default: 'normal' }) public type: string
    @prop() public content: Author
    @prop() public eventDate: Date
    @prop() public eventLocation: string
    @arrayProp({ type: String }) public tags: string[]
    @arrayProp({ type: String }) public images: string[]
    @prop() public linkEmbed: LinkEmbed
    @arrayProp({ type: Comment }) public comments: Comment[]
    @prop() public reactions: Reactions
}

export class CreateCommentError extends Error { }
export class FindCommentError extends Error { }
export class UpdateCommentError extends Error { }
export class DeleteCommentError extends Error { }

export class CreatePostError extends Error { }
export class FindPostError extends Error { }
export class UpdatePostError extends Error { }
export class DeletePostError extends Error { }

