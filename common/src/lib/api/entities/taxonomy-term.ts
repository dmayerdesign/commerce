import * as findOrCreate from 'mongoose-findorcreate'

import { arrayProp, model, plugin, prop, MongooseDocument, MongooseSchemaOptions, Ref } from '../../goosetype'
import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { PageSettings } from './page-settings'
import { Taxonomy } from './taxonomy'

@plugin(findOrCreate)
@model(MongooseSchemaOptions.timestamped)
export class TaxonomyTerm extends MongooseDocument {
    @prop({ ref: Taxonomy }) public taxonomy: Ref<Taxonomy>
    @prop() public singularName: string
    @prop() public pluralName: string
    @prop() public slug: string
    @prop() public description: string

    // Tree properties.
    @prop({ ref: TaxonomyTerm }) public parent: Ref<TaxonomyTerm>
    @arrayProp({ ref: TaxonomyTerm }) public children: Ref<TaxonomyTerm>[]

    // Defaults.
    @arrayProp({ ref: Attribute }) public defaultAttributes: Ref<Attribute>[]
    @arrayProp({ ref: AttributeValue }) public defaultAttributeValues: Ref<AttributeValue>[]

    // Page settings.
    @prop() public pageSettings: PageSettings
    @prop({ ref: Taxonomy }) public archiveGroupsTaxonomy: Ref<Taxonomy>
    @arrayProp({ ref: TaxonomyTerm }) public archiveTermGroups: Ref<TaxonomyTerm>[]
}

export class CreateTaxonomyTermError extends Error { }
export class FindTaxonomyTermError extends Error { }
export class UpdateTaxonomyTermError extends Error { }
export class DeleteTaxonomyTermError extends Error { }
