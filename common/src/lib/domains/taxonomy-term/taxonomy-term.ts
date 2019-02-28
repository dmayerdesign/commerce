import { ObjectId } from 'mongodb'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne,
    ObjectIdColumn, OneToMany, UpdateDateColumn } from 'typeorm'
import { AttributeValue } from '../attribute-value/attribute-value'
import { Attribute } from '../attribute/attribute'
import { PageSettings } from '../page-settings/page-settings'
import { Taxonomy } from '../taxonomy/taxonomy'
import { TaxonomyTerm as ITaxonomyTerm } from './taxonomy-term.interface'

@Entity()
export class TaxonomyTerm implements ITaxonomyTerm {
    @ObjectIdColumn() public id: ObjectId

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
