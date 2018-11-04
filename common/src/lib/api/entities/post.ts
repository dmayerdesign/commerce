import { arrayProp, model, prop, schema, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { User } from './user'

@schema(LinkEmbed)
export class LinkEmbed {
    @prop() public url: string
    @prop() public type: string
    @prop() public thumbnail_url: string
    @prop() public title: string
    @prop() public description: string
    @prop() public provider_url: string
}

@schema(Author)
export class Author {
    @prop() public userId: string
    @prop() public firstName: string
    @prop() public lastName: string
}

@schema(Reactions)
export class Reactions {
    @arrayProp({ itemsRef: User }) public up: Ref<User>[]
    @arrayProp({ itemsRef: User }) public down: Ref<User>[]
}

@model(Comment, MongooseSchemaOptions.timestamped)
export class Comment extends MongooseDocument {
    @prop() public author: Author
    @prop() public content: string
    @arrayProp({ itemsType: String }) public images: string[]
    @prop() public linkEmbed: LinkEmbed
    @prop() public reactions: Reactions
}

@model(Post, MongooseSchemaOptions.timestamped)
export class Post extends MongooseDocument {
    @prop() public author: Author
    @prop({ default: 'normal' }) public type: string
    @prop() public content: Author
    @prop() public eventDate: Date
    @prop() public eventLocation: string
    @arrayProp({ itemsType: String }) public tags: string[]
    @arrayProp({ itemsType: String }) public images: string[]
    @prop() public linkEmbed: LinkEmbed
    @arrayProp({ itemsType: Comment }) public comments: Comment[]
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

