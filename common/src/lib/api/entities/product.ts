import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, ObjectIdColumn, ObjectID, OneToMany, UpdateDateColumn, ManyToMany } from 'typeorm'
import { Product as IProduct } from '../interfaces/product'
import { Attribute } from './attribute'
import { AttributeValue } from './attribute-value'
import { Dimensions } from './dimensions'
import { Image } from './image'
import { Price } from './price'
import { SimpleAttributeValue } from './simple-attribute-value'
import { TaxonomyTerm } from './taxonomy-term'
import { Units } from './units'
import { Weight } from './weight'

@Entity()
export class Product implements IProduct {
    @ObjectIdColumn() public id: ObjectID
    // Aesthetic.
    @Column() public name: string
    @Column() public slug: string
    @Column() public description: string

    @ManyToMany(() => Image, image => image.id)
    @JoinColumn()
    public featuredImages: Image[]

    @ManyToMany(() => Image, image => image.id)
    @JoinColumn()
    public images: Image[]

    // Organizational.
    @Column({ unique: true }) public sku: string
    @Column() public isStandalone: boolean
    @Column() public isParent: boolean
    @Column() public parentSku: string

    @ManyToOne(() => Product, product => product.id)
    @JoinColumn()
    public parent: Product

    // Financial.
    @Column(() => Price) public price: Price
    @Column(() => Price) public priceRange: Price[]
    @Column(() => Price) public salePrice: Price
    @Column(() => Price) public salePriceRange: Price[]
    @Column() public isOnSale: boolean
    @Column() public variationSkus: string[]

    @OneToMany(() => Product, product => product.id)
    @JoinColumn()
    public variations: Product[]

    @Column() public isVariation: boolean
    @Column() public isDefaultVariation: boolean

    // Attributes.
    // Own attributes.
    @ManyToMany(() => AttributeValue, attributeValue => attributeValue.id)
    @JoinColumn()
    public attributeValues: AttributeValue[]

    @Column(() => SimpleAttributeValue)
    public simpleAttributeValues: SimpleAttributeValue[]

    // Variation attributes.
    @Column() public variableProperties: string[]

    @ManyToMany(() => Attribute, attribute => attribute.id)
    @JoinColumn()
    public variableAttributes: Attribute[]

    @ManyToMany(() => AttributeValue, attributeValue => attributeValue.id)
    @JoinColumn()
    public variableAttributeValues: AttributeValue[]

    @Column(() => SimpleAttributeValue)
    public variableSimpleAttributeValues: SimpleAttributeValue[]

    // Taxonomy.
    @ManyToMany(() => TaxonomyTerm, taxonomyTerm => taxonomyTerm.id)
    @JoinColumn()
    public taxonomyTerms: TaxonomyTerm[]

    @Column() public taxonomyTermSlugs: string[]

    // Shipping.
    @Column(() => Units) public units: Units
    @Column(() => Dimensions) public dimensions: Dimensions
    @Column(() => Weight) public shippingWeight: Weight
    @Column(() => Weight) public netWeight: Weight

    // Additional tax.
    @Column() public additionalTax: number

    // Sales.
    @Column() public stockQuantity: number
    @Column() public totalSales: number
    @Column() public existsInStripe: boolean

    @CreateDateColumn({ type: 'timestamp' }) public createdAt?: Date
    @UpdateDateColumn({ type: 'timestamp' }) public updatedAt?: Date

    @BeforeInsert()
    @BeforeUpdate()
    public normalizeSlug(): void {
        const product = this
        if (!product.slug) {
            product.slug = product.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
        }
        if (product.slug) {
            product.slug = product.slug.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
        }
    }
}
