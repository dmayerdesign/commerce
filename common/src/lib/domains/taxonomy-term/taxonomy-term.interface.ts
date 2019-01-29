import { AttributeValue } from '../attribute-value/attribute-value.interface'
import { Attribute } from '../attribute/attribute.interface'
import { Entity } from '../data-access/entity.interface'
import { PageSettings } from '../page-settings/page-settings.interface'
import { Taxonomy } from '../taxonomy/taxonomy.interface'

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
