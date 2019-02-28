import { ObjectID } from 'mongodb'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ObjectIdColumn, OneToMany, UpdateDateColumn } from 'typeorm'
import { Image } from '../image/image'
import { Comment as IComment } from '../post/post.interface'
import { Post as IPost } from '../post/post.interface'
import { User } from '../user/user'

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
    @OneToMany(() => User, user => user.id)
    @JoinColumn()
    public up: User[]

    @OneToMany(() => User, user => user.id)
    @JoinColumn()
    public down: User[]
}

@Entity()
export class Comment implements IComment {
    @ObjectIdColumn() public id: ObjectID
    @Column(() => Author) public author: Author
    @Column() public content: string

    @ManyToMany(() => Image, image => image.id)
    @JoinColumn()
    public images: Image[]

    @Column(() => LinkEmbed) public linkEmbed: LinkEmbed
    @Column(() => Reactions) public reactions: Reactions
}

@Entity()
export class Post implements IPost {
    @ObjectIdColumn() public id: ObjectID
    @Column(() => Author) public author: Author
    @Column({ default: 'normal' }) public type: string
    @Column(() => Author) public content: Author
    @Column() public eventDate: Date
    @Column() public eventLocation: string
    @Column() public tags: string[]

    @ManyToMany(() => Image, image => image.id)
    @JoinColumn()
    public images: Image[]

    @Column(() => LinkEmbed) public linkEmbed: LinkEmbed

    @OneToMany(() => Comment, comment => comment.id)
    @JoinColumn()
    public comments: Comment[]

    @Column(() => Reactions) public reactions: Reactions
    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
