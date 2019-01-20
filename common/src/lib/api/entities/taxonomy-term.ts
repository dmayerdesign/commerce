import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, ObjectIdColumn, ObjectID, OneToMany, UpdateDateColumn } from 'typeorm'
import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { PageSettings } from './page-settings'
import { Taxonomy } from './taxonomy'

@Entity()
export class TaxonomyTerm {
    @ObjectIdColumn() public id: ObjectID

    @ManyToOne(() => Taxonomy, x => x.id)
    @JoinColumn()
    public taxonomy: Taxonomy

    @Column() public singularName: string
    @Column() public pluralName: string
    @Column() public slug: string
    @Column() public description: string

    // Tree properties.
    @ManyToOne(() => TaxonomyTerm, x => x.id)
    @JoinColumn()
    public parent: TaxonomyTerm

    @OneToMany(() => TaxonomyTerm, x => x.id)
    @JoinColumn()
    public children: TaxonomyTerm[]

    // Defaults.
    @ManyToMany(() => Attribute, x => x.id)
    @JoinColumn()
    public defaultAttributes: Attribute[]

    @ManyToMany(() => AttributeValue, x => x.id)
    @JoinColumn()
    public defaultAttributeValues: AttributeValue[]

    // Page settings.
    @Column(() => PageSettings) public pageSettings: PageSettings
    @Column(() => Taxonomy) public archiveGroupsTaxonomy: Taxonomy
    @OneToMany(() => TaxonomyTerm, x => x.id)
    @JoinColumn()
    public archiveTermGroups: TaxonomyTerm[]


    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date
}
