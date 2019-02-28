import { ObjectId } from 'mongodb'
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'
import { Taxonomy as ITaxonomy } from './taxonomy.interface'

@Entity()
export class Taxonomy implements ITaxonomy {
    @ObjectIdColumn() public id: ObjectId
    @Column() public slug: string
    @Column() public singularName?: string
    @Column() public pluralName?: string
    @Column() public description?: string

    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
