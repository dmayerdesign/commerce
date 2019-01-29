import { Column, CreateDateColumn, Entity, ObjectIdColumn, ObjectID, UpdateDateColumn } from 'typeorm'
import { Taxonomy as ITaxonomy } from './taxonomy.interface'

@Entity()
export class Taxonomy implements ITaxonomy {
    @ObjectIdColumn() public id: ObjectID
    @Column() public slug: string
    @Column() public singularName?: string
    @Column() public pluralName?: string
    @Column() public description?: string

    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
