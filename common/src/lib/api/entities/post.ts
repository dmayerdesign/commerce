import { Column, CreateDateColumn, Entity, ObjectIdColumn, ObjectID, OneToMany, UpdateDateColumn } from 'typeorm'
import { Comment as IComment } from '../interfaces/post'
import { Post as IPost } from '../interfaces/post'
import { Image } from './image'
import { User } from './user'

export class LinkEmbed {
    @Column() public url: string
    @Column() public type: string
    @Column() public thumbnail_url: string
    @Column() public title: string
    @Column() public description: string
    @Column() public provider_url: string
}

export class Author {
    @Column() public userId: string
    @Column() public firstName: string
    @Column() public lastName: string
}

export class Reactions {
    @OneToMany(() => User, user => user.id) public up: User[]
    @OneToMany(() => User, user => user.id) public down: User[]
}

@Entity()
export class Comment implements IComment {
    @ObjectIdColumn() public id: ObjectID
    @Column() public author: Author
    @Column() public content: string
    @OneToMany(() => Image, image => image.id) public images: string[]
    @Column() public linkEmbed: LinkEmbed
    @Column() public reactions: Reactions
}

@Entity()
export class Post implements IPost {
    @ObjectIdColumn() public id: ObjectID
    @Column() public author: Author
    @Column({ default: 'normal' }) public type: string
    @Column() public content: Author
    @Column() public eventDate: Date
    @Column() public eventLocation: string
    @Column() public tags: string[]
    @OneToMany(() => Image, image => image.id) public images: Image[]
    @Column() public linkEmbed: LinkEmbed
    @OneToMany(() => Comment, comment => comment.id) public comments: Comment[]
    @Column() public reactions: Reactions
    @CreateDateColumn({ type: 'timestamp' }) public createdAt: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt: Date
}
