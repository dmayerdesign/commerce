import { Document } from 'mongoose'
import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { PageSettings } from './page-settings'
import { Ref } from './ref'
import { Taxonomy } from './taxonomy'

export interface TaxonomyTerm extends Document {
    taxonomy: Ref<Taxonomy>
    singularName: string
    pluralName: string
    slug: string
    description: string

    // Tree properties.
    parent: Ref<TaxonomyTerm>
    children: Ref<TaxonomyTerm>[]

    // Defaults.
    defaultAttributes: Ref <Attribute>[]
    defaultAttributeValues: Ref<AttributeValue>[]

    // Page settings.
    pageSettings: PageSettings
    archiveGroupsTaxonomy: Ref<Taxonomy>
    archiveTermGroups: Ref<TaxonomyTerm>[]
}
