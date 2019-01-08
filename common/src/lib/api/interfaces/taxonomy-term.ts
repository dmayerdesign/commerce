import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { Entity } from './entity'
import { PageSettings } from './page-settings'
import { Taxonomy } from './taxonomy'

export interface TaxonomyTerm extends Entity {
    taxonomy: Taxonomy
    singularName: string
    pluralName: string
    slug: string
    description: string

    // Tree properties.
    parent: TaxonomyTerm
    children: TaxonomyTerm[]

    // Defaults.
    defaultAttributes: Attribute[]
    defaultAttributeValues: AttributeValue[]

    // Page settings.
    pageSettings: PageSettings
    archiveGroupsTaxonomy: Taxonomy
    archiveTermGroups: TaxonomyTerm[]
}
