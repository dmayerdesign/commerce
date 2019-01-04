import { arrayProp, model, prop, schema, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { User } from './user'

@schema()
export class LinkEmbed {
    @Column() public url: string
    @Column() public type: string
    @Column() public thumbnail_url: string
    @Column() public title: string
    @Column() public description: string
    @Column() public provider_url: string
}

@schema()
export class Author {
    @Column() public userId: string
    @Column() public firstName: string
    @Column() public lastName: string
}

@schema()
export class Reactions {
    @OneToMany({ ref: User }) public up: Ref<User>[]
    @OneToMany({ ref: User }) public down: Ref<User>[]
}

@model(MongooseSchemaOptions.timestamped)
export class Comment {
    @ObjectIdColumn() public id: ObjectID
    @Column() public author: Author
    @Column() public content: string
    @OneToMany({ type: String }) public images: string[]
    @Column() public linkEmbed: LinkEmbed
    @Column() public reactions: Reactions
}

@model(MongooseSchemaOptions.timestamped)
export class Post {
    @ObjectIdColumn() public id: ObjectID
    @Column() public author: Author
    @Column({ default: 'normal' }) public type: string
    @Column() public content: Author
    @Column() public eventDate: Date
    @Column() public eventLocation: string
    @OneToMany({ type: String }) public tags: string[]
    @OneToMany({ type: String }) public images: string[]
    @Column() public linkEmbed: LinkEmbed
    @OneToMany({ type: Comment }) public comments: Comment[]
    @Column() public reactions: Reactions
}
