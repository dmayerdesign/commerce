import * as findOrCreate from 'mongoose-findorcreate'

import { arrayProp, model, plugin, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { PageSettings } from './page-settings'
import { Taxonomy } from './taxonomy'

@plugin(findOrCreate)
@model(MongooseSchemaOptions.timestamped)
export class TaxonomyTerm {
    @ObjectIdColumn() public id: ObjectID
    @Column({ ref: Taxonomy }) public taxonomy: Ref<Taxonomy>
    @Column() public singularName: string
    @Column() public pluralName: string
    @Column() public slug: string
    @Column() public description: string

    // Tree properties.
    @Column({ ref: TaxonomyTerm }) public parent: Ref<TaxonomyTerm>
    @OneToMany({ ref: TaxonomyTerm }) public children: Ref<TaxonomyTerm>[]

    // Defaults.
    @OneToMany({ ref: Attribute }) public defaultAttributes: Ref<Attribute>[]
    @OneToMany({ ref: AttributeValue }) public defaultAttributeValues: Ref<AttributeValue>[]

    // Page settings.
    @Column() public pageSettings: PageSettings
    @Column({ ref: Taxonomy }) public archiveGroupsTaxonomy: Ref<Taxonomy>
    @OneToMany({ ref: TaxonomyTerm }) public archiveTermGroups: Ref<TaxonomyTerm>[]
}
