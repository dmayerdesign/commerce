import { Inject, Injectable } from '@nestjs/common'
// import { Attribute } from '@qb/common/api/entities/attribute'
import { AttributeValue } from '@qb/common/api/entities/attribute-value'
import { Image } from '@qb/common/api/entities/image'
import { Price } from '@qb/common/api/entities/price'
import { Product } from '@qb/common/api/entities/product'
// import { Taxonomy } from '@qb/common/api/entities/taxonomy'
import { TaxonomyTerm } from '@qb/common/api/entities/taxonomy-term'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { Currency } from '@qb/common/constants/enums/currency'
import { RangeLimit } from '@qb/common/constants/enums/range-limit'
import { WeightUnit } from '@qb/common/constants/enums/weight-unit'
import * as productsJSON from '@qb/common/work-files/migration/hyzershop-products'
import { pluralize, singularize, titleize } from 'inflection'
import { camelCase, cloneDeep, kebabCase } from 'lodash'
import { ObjectID } from 'typeorm'
import { AttributeValueRepository } from '../attribute-value/attribute-value.repository.generated'
import { AttributeRepository } from '../attribute/attribute.repository.generated'
import { ProductRepository } from '../product/product.repository.generated'
import { TaxonomyTermRepository } from '../taxonomy-term/taxonomy-term.repository.generated'
import { TaxonomyRepository } from '../taxonomy/taxonomy.repository.generated'

@Injectable()
export class HyzershopMigrationService {

    constructor(
        @Inject(ProductRepository)
        private readonly _productRepository: ProductRepository,
        @Inject(AttributeRepository)
        private readonly _attributeRepository: AttributeRepository,
        @Inject(AttributeValueRepository)
        private readonly _attributeValueRepository: AttributeValueRepository,
        @Inject(TaxonomyRepository)
        private readonly _taxonomyRepository: TaxonomyRepository,
        @Inject(TaxonomyTermRepository)
        private readonly _taxonomyTermRepository: TaxonomyTermRepository,
    ) { }

    public async createProductsFromExportedJSON(): Promise<Product[]> {
        const newProducts = [] as Product[]

        const dropAllProductRelatedCollections = async () => {
            console.warn('Skipping drops for product, attribute, attribute value, taxonomy, and taxonomy term.')
            // await Product.getModel().collection.drop()
            // await Attribute.getModel().collection.drop()
            // await AttributeValue.getModel().collection.drop()
            // await Taxonomy.getModel().collection.drop()
            // await TaxonomyTerm.getModel().collection.drop()
        }

        await dropAllProductRelatedCollections()

        const buildProducts = async () => {
            for (const product of productsJSON as any) {
                if (!!product['Product Name'].match(/^Template/)) {
                    continue
                }
                if (product['Product ID'] === '1195') {
                    product['Product SKU'] = 'STRATUS_X_1776'
                }
                if (product['Product ID'] === '1057') {
                    product['Product SKU'] = 'BUZZZ_PROD_1747'
                }

                const keys = Object.keys(product)
                keys.forEach((key) => {
                    let newKey = camelCase(key)

                    if (!!newKey.match(/^attribute/)) {
                        newKey = 'attribute.' + camelCase(newKey.replace(/^attribute/, ''))
                    }
                    if (newKey === 'category') {
                        newKey = 'productType'
                    }
                    product[newKey] = product[key]
                    delete product[key]
                })

                const newProduct: Product = cloneDeep(product)

                const variableAttributeIds: ObjectID[] = []
                const variableAttributeValueIds: ObjectID[] = []
                const attributeValueIds: ObjectID[] = []
                const simpleAttributeValues: { attribute: ObjectID, value: any }[] = []
                const taxonomyTermIds: ObjectID[] = []

                const flightStats: {
                    fade:  number | undefined
                    glide: number | undefined
                    speed: number | undefined
                    turn:  number | undefined
                } = {
                    fade:  undefined,
                    glide: undefined,
                    speed: undefined,
                    turn:  undefined,
                }

                for (const key of Object.keys(product)) {
                    if (typeof newProduct[key] !== 'undefined' && newProduct[key] !== undefined && newProduct[key] !== '') {
                        if (key === 'productId') {
                            delete newProduct[key]
                            continue
                        }

                        if (key.indexOf('attribute.') > -1) {
                            const theKey = camelCase(key.replace('attribute.', ''))

                            if (
                                theKey === 'color' ||
                                theKey === 'plastic' ||
                                theKey === 'rimColor'
                            ) {
                                if (typeof product[key] === 'string') {
                                    if (product.type === 'Variable' && product[key].indexOf('|') > -1) {
                                        const variableAttributeValueSlugs = product[key]
                                            .split('|')
                                            .map((val) => {
                                                return kebabCase(theKey + '-' + val.replace(/\s/g, '-').replace(/[\(\)]/g, '').toLowerCase())
                                            })
                                        const variableAttributeValueValues = product[key].split('|')
                                        const variableAttributeSlug = kebabCase(theKey)
                                        try {
                                            const variableAttribute = await this._attributeRepository
                                                .getOrCreate({
                                                    slug: variableAttributeSlug
                                                })
                                            variableAttributeIds.push(variableAttribute.id)
                                            for (const variableAttributeValueSlug of variableAttributeValueSlugs) {
                                                try {
                                                    const variableAttributeValue = await this._attributeValueRepository.getOrCreate({
                                                        attribute: variableAttribute.id,
                                                        slug: variableAttributeValueSlug,
                                                        value: variableAttributeValueValues[variableAttributeValueSlugs.indexOf(variableAttributeValueSlug)],
                                                    })
                                                    variableAttributeValueIds.push(variableAttributeValue.id)
                                                }
                                                catch (error) {
                                                    throw error
                                                }
                                            }
                                        }
                                        catch (error) {
                                            throw error
                                        }
                                    }
                                    else {
                                        const value = newProduct[key]
                                        const attributeValueSlug = kebabCase(theKey + '-' + newProduct[key].replace(/\s/g, '-').replace(/[\(\)]/g, '').toLowerCase())
                                        const attributeSlug = kebabCase(theKey)
                                        try {
                                            const attribute = await this._attributeRepository.getOrCreate({
                                                slug: attributeSlug
                                            })
                                            const attributeValue = await this._attributeValueRepository.getOrCreate({
                                                attribute: attribute.id,
                                                slug: attributeValueSlug,
                                                value,
                                            })
                                            attributeValueIds.push(attributeValue.id)
                                            delete newProduct[key]
                                        }
                                        catch (error) {
                                            throw error
                                        }
                                    }
                                }
                            }
                            else if (theKey === 'scaledWeight') {
                                if ((newProduct[key] as any).indexOf('|') > -1) {
                                    if (!newProduct.variableProperties) {
                                        newProduct.variableProperties = []
                                    }
                                    if (newProduct.variableProperties.indexOf('netWeight') === -1) {
                                        newProduct.variableProperties.push('netWeight')
                                    }
                                }
                                else {
                                    if (newProduct[key].length) {
                                        newProduct.netWeight = {
                                            amount: parseFloat(newProduct[key]),
                                            unitOfMeasurement: WeightUnit.Grams
                                        }
                                    }
                                }
                                delete newProduct[key]
                            }
                        }

                        if (key === 'fade' || key === 'glide' || key === 'turn' || key === 'speed') {
                            flightStats[key] = newProduct[key]

                            // Add speed/glide/turn/fade Attribute.

                            const speedGlideTurnFadeAttribute = await this._attributeRepository.getOrCreate({ slug: key })
                            simpleAttributeValues.push({
                                attribute: speedGlideTurnFadeAttribute.id,
                                value: flightStats[key]
                            })

                            // Add stability AttributeValue and TaxonomyTerm.

                            const getStability = function(stabilityStats): 'overstable'|'stable'|'understable'|undefined {
                                const fadePlusTurn = parseFloat(`${stabilityStats.fade}`) + parseFloat(`${stabilityStats.turn}`)
                                if (fadePlusTurn >= 3) {
                                    return 'overstable'
                                }
                                else if (fadePlusTurn < 3 && fadePlusTurn >= 0) {
                                    return 'stable'
                                }
                                else if (fadePlusTurn < 0) {
                                    return 'understable'
                                }
                            }

                            if (Object.keys(flightStats).every(statKey => typeof flightStats[statKey] !== 'undefined')) {
                                try {
                                    const stabilityValue = getStability(flightStats)
                                    const attributeSlug = 'stability'
                                    const taxonomySlug = 'stability'
                                    const attributeValueSlug = attributeSlug + '-' + stabilityValue
                                    const taxonomyTermSlug = taxonomySlug + '-' + stabilityValue

                                    const attribute = await this._attributeRepository.getOrCreate({
                                        slug: attributeSlug,
                                    })
                                    const attributeValue = await this._attributeValueRepository.getOrCreate({
                                        attribute: attribute.id,
                                        slug: attributeValueSlug,
                                        value: stabilityValue,
                                    })
                                    attributeValueIds.push(attributeValue.id)

                                    const taxonomy = await this._taxonomyRepository.getOrCreate({
                                        slug: taxonomySlug,
                                    })
                                    const taxonomyTerm = await this._taxonomyTermRepository.getOrCreate({
                                        taxonomy: taxonomy.id,
                                        slug: taxonomyTermSlug,
                                    })
                                    taxonomyTermIds.push(taxonomyTerm.id)
                                }
                                catch (error) {
                                    throw error
                                }
                            }
                        }

                        if (key === 'inboundsId') {
                            const inboundsIdAttribute = await this._attributeRepository.getOrCreate({ slug: kebabCase(key) })
                            simpleAttributeValues.push({
                                attribute: inboundsIdAttribute.id,
                                value: newProduct[key]
                            })
                        }

                        if (
                            key === 'brands' ||
                            key === 'discType' ||
                            key === 'productType'
                        ) {
                            const taxonomyTermPromises: Promise<TaxonomyTerm>[] = []
                            const taxonomySlug = kebabCase(singularize(key))
                            const taxonomyTermSlugs = product[key].split('|').map((originalTaxonomyTermSlug) => {
                                return kebabCase(taxonomySlug + '-' + originalTaxonomyTermSlug.replace(/\s/g, '-').toLowerCase()).trim()
                            })

                            try {
                                const taxonomy = await this._taxonomyRepository.getOrCreate({ slug: taxonomySlug })

                                taxonomyTermSlugs.forEach((taxonomyTermSlug) => {
                                    taxonomyTermPromises.push(this._taxonomyTermRepository.getOrCreate({
                                        taxonomy: taxonomy.id,
                                        slug: taxonomyTermSlug
                                    }))
                                })

                                const taxonomyTerms = await Promise.all(taxonomyTermPromises)

                                taxonomyTerms.forEach((taxonomyTerm) => taxonomyTermIds.push(taxonomyTerm.id))
                                newProduct.taxonomyTermSlugs = taxonomyTermSlugs

                                delete newProduct[key]
                            }
                            catch (error) {
                                throw error
                            }
                        }
                        if (key === 'price') {
                            if ( newProduct[key].toString().indexOf('-') > -1 ) {
                                const priceRangeTotals = (newProduct[key] as any).split('-')
                                newProduct.priceRange = [
                                    {
                                        amount: 0,
                                        currency: Currency.USD,
                                    } as Price,
                                    {
                                        amount: 0,
                                        currency: Currency.USD,
                                    } as Price,
                                ]
                                newProduct.priceRange[RangeLimit.Min].amount = parseFloat(priceRangeTotals[RangeLimit.Min])
                                newProduct.priceRange[RangeLimit.Max].amount = parseFloat(priceRangeTotals[RangeLimit.Max])
                                delete newProduct[key]
                            }
                            else {
                                newProduct[key] = {
                                    amount: +newProduct[key],
                                    currency: Currency.USD
                                } as Price
                            }
                        }
                        if (key === 'salePrice') {
                            if ( newProduct.salePrice.toString().indexOf('-') > -1 ) {
                                const salePriceRangeTotals = (newProduct[key] as any).split('-')
                                newProduct.salePriceRange = [
                                    {
                                        amount: 0,
                                        currency: Currency.USD,
                                    } as Price,
                                    {
                                        amount: 0,
                                        currency: Currency.USD,
                                    } as Price,
                                ]
                                newProduct.salePriceRange[RangeLimit.Min].amount = parseFloat(
                                    salePriceRangeTotals[RangeLimit.Min]
                                )
                                newProduct.salePriceRange[RangeLimit.Max].amount = parseFloat(
                                    salePriceRangeTotals[RangeLimit.Max]
                                )
                                delete newProduct.salePrice
                            }
                            else {
                                newProduct.salePrice = {
                                    amount: +newProduct[key],
                                    currency: Currency.USD,
                                } as Price
                            }
                        }

                        if (key === 'type') {
                            if ((newProduct as any).type === 'Variable') {
                                newProduct.isParent = true
                            }
                            if ((newProduct as any).type === 'Variation') {
                                newProduct.isVariation = true
                            }
                            if ((newProduct as any).type === 'Simple Product') {
                                newProduct.isStandalone = true
                            }
                            delete newProduct[key]
                        }

                        if (key === 'excerpt') {
                            if (newProduct[key]) {
                                newProduct.description = newProduct[key].replace(/http:\/\/stage\.hyzershop\.com\/product/g, '/shop/product')
                                newProduct.description = newProduct.description.replace(/https:\/\/hyzershop\.com\/product/g, '/shop/product')
                                newProduct.description = newProduct.description.replace(/https:\/\/www\.hyzershop\.com\/product/g, '/shop/product')
                                newProduct.description = newProduct.description.replace(/Š—È/g, '\'')
                                newProduct.description = newProduct.description.replace(/ŠÜ¢/g, ' –')
                                newProduct.description = newProduct.description.replace('<div class="longdescription">', '\n')
                                newProduct.description = newProduct.description.replace('</div>', '')
                                newProduct.description = newProduct.description.replace(/Î¾/g, ' ')
                            }
                            delete newProduct[key]
                        }

                        if (key === 'productSku') {
                            newProduct.sku = newProduct[key]
                            delete newProduct[key]
                        }

                        if (key === 'productName') {
                            newProduct.name = newProduct[key].replace(/ŠÜ¢/g, ' -')
                            delete newProduct[key]
                        }

                        if (key === 'quantity') {
                            newProduct.stockQuantity = newProduct[key]
                            delete newProduct[key]
                        }
                    }
                    else {
                        delete newProduct[key]
                    }
                }

                // !!!!!!!!!!!!!!!!!!
                // [ EXCEPTION ]
                // !!!!!!!!!!!!!!!!!!

                const slug = newProduct.slug
                if (slug === 'product-754-variation-6') {
                    newProduct.sku = 'CHALLENGER_PROD_1697'
                }
                if (slug === 'discraft-hornet') {
                    newProduct.sku = 'HORNET'
                }
                if (slug === 'axiom-thrill') {
                    newProduct.sku = 'THRILL'
                }
                if (slug === 'product-2237-variation-2') {
                    newProduct.sku = 'ENERGY_NEUTRON_1678'
                }

                const sku = newProduct.sku
                if (sku === 'METEOR_GLOZ_1769') {
                    if (newProducts.find((p) => p.sku === 'METEOR_GLOZ_1769')) {
                        newProduct.sku = 'METEOR_GLOZ_1769_2'
                    }
                }
                if (!!sku.match(/^THRILL_/)) {
                    newProduct.parentSku = 'THRILL'
                }
                if (!!sku.match(/^HORNET_/)) {
                    newProduct.parentSku = 'HORNET'
                }

                /////////////////////

                newProduct.variableAttributes = variableAttributeIds as any[]
                newProduct.variableAttributeValues = variableAttributeValueIds as any[]
                newProduct.attributeValues = attributeValueIds as any[]
                newProduct.simpleAttributeValues = simpleAttributeValues as any[]
                newProduct.taxonomyTerms = taxonomyTermIds as any[]

                delete (newProduct as any).images
                delete (newProduct as any).featuredImage
                delete (newProduct as any).thumbnail

                newProducts.push(newProduct)
            }
        }

        try {
            await buildProducts()
        }
        catch (error) {
            console.log(error)
            throw error
        }

        /*************
         * The switch
         ******* -> */
        try {
            const allProducts = await this._productRepository.insertMany(newProducts)
            const parentProducts = allProducts.filter((p) => p.isParent)
            const variationProducts = allProducts.filter((p) => p.isVariation)

            // Populate the `variations` array.

            for (let i = 0; i < parentProducts.length; i++) {
                const parentProduct = parentProducts[i]
                const variations = allProducts.filter((p) => p.parentSku === parentProduct.sku)
                parentProduct.variations = variations.map((v) => v.id) as any[]
                await this._productRepository.update(
                    new UpdateRequest<Product>({
                        id: parentProduct.id,
                        update: parentProduct,
                        unsafeArrayUpdates: true
                    })
                )
            }

            // Populate the images.

            for (let i = 0; i < allProducts.length; i++) {
                const product = allProducts[i]
                product.featuredImages = []
                product.images = []

                if (!product.isParent) {
                    let isDisc = false
                    let attributeValues: AttributeValue[]
                    let taxonomyTerms: TaxonomyTerm[]
                    let imageBaseUrl = `/product-images/`

                    if (product.taxonomyTermSlugs) {
                        product.taxonomyTermSlugs.forEach((term) => {
                            if (term && term.indexOf('brand') === 0) {
                                if (term.match(/mvp/ig)) {
                                    imageBaseUrl += 'mvp-'
                                }
                                if (term.match(/axiom/ig)) {
                                    imageBaseUrl += 'axiom-'
                                }
                                if (term.match(/discraft/ig)) {
                                    imageBaseUrl += 'discraft-'
                                }
                            }
                        })
                    }

                    try {
                        attributeValues = await this._attributeValueRepository.list(
                            new ListRequest({ ids: product.attributeValues.map(x => x.id) })
                        )
                        taxonomyTerms = await this._taxonomyTermRepository.list(
                            new ListRequest({ ids: product.taxonomyTerms.map(x => x.id) })
                        )
                        isDisc = taxonomyTerms && taxonomyTerms.some((taxTerm) => taxTerm.slug === 'product-type-discs')
                    }
                    catch (error) {
                        throw error
                    }
console.log(`SKU: ${JSON.stringify(product)}`)
                    const name = product.name.substring(0, product.name.indexOf(' -'))
                    imageBaseUrl += kebabCase(name).replace(/\W/g, '-')

                    if (isDisc) {
                        attributeValues.forEach((attributeValue) => {
                            if (attributeValue && attributeValue.slug.indexOf('plastic') > -1) {
                                const plasticStr = kebabCase(attributeValue.value).replace(/\W/g, '')
                                imageBaseUrl += `-${plasticStr}`
                            }
                        })
                        if (typeof product.netWeight !== 'undefined') {
                            let netWeightStr = product.netWeight.amount.toString()
                                .replace('.', '')
                            if (netWeightStr.length === 2) netWeightStr += '00'
                            if (netWeightStr.length === 3) netWeightStr += '0'
                            imageBaseUrl += `-${netWeightStr}`
                        }
                    } else {
                        attributeValues.forEach((attributeValue) => {
                            if (attributeValue && attributeValue.slug.indexOf('color') > -1) {
                                imageBaseUrl += `-${kebabCase(attributeValue.value)}`
                            }
                        })
                    }

                    // Populate images for non-disc products.

                    imageBaseUrl.replace(/[-]{2,3}/g, '-')
                    imageBaseUrl.replace(/\-$/, '-')
                    if (product.sku === 'DISCRAFTSTARTER') {
                        imageBaseUrl = '/product-images/discraft-disc-golf-set'
                    }
                    if (product.sku === 'DISCRAFTDELUXE') {
                        imageBaseUrl = '/product-images/discraft-deluxe-disc-golf-set'
                    }
                    if (product.sku === 'BLACKHOLE_PRO') {
                        imageBaseUrl = '/product-images/discraft-deluxe-disc-golf-set'
                    }
                    if (product.sku === 'BLACKHOLE_PRECISION') {
                        imageBaseUrl = '/product-images/discraft-deluxe-disc-golf-set'
                    }
                    if (product.sku === 'BLACKHOLE_PRACTICE') {
                        imageBaseUrl = '/product-images/discraft-deluxe-disc-golf-set'
                    }

                    const productImage = {
                        large: imageBaseUrl + '-large.png',
                        medium: imageBaseUrl + '-medium.png',
                        thumbnail: imageBaseUrl + '-thumbnail.png',
                    } as Image

                    product.featuredImages.push(productImage)
                    product.images.push(productImage)
                }

                await this._productRepository.update(
                    new UpdateRequest<Product>({
                        id: product.id,
                        update: product,
                        unsafeArrayUpdates: true
                    })
                )
            }

            // Populate parent product images with variation images.

            for (let i = 0; i < parentProducts.length; i++) {
                const product = parentProducts[i]
                let variations = [] as any[]
                if (product.isParent) {
                    variations = allProducts.filter(p => product.sku === p.parentSku)
                    variations.forEach((pv) => {
                        product.featuredImages = product.featuredImages.concat(pv.featuredImages)
                        product.images = product.images.concat(pv.images)
                    })
                }

                await this._productRepository.update(
                    new UpdateRequest<Product>({
                        id: product.id,
                        update: product,
                        unsafeArrayUpdates: true
                    })
                )
            }

            // Populate parent products with variation attributes and attribute values.

            for (let i = 0; i < variationProducts.length; i++) {
                const variation = variationProducts[i]
                const parent = parentProducts.find((p) => p.sku === variation.parentSku)

                if (!parent) {
                    throw new Error(`Could not find a parent for the product variation: ${JSON.stringify(variation)}`)
                }

                // Add the parent to the variation.
                variation.parent = parent.id as any

                if (!parent.variableAttributes) {
                    parent.variableAttributes = []
                }
                if (!parent.variableAttributeValues) {
                    parent.variableAttributeValues = []
                }

                variation.variableAttributes.forEach((attrId) => {
                    if (!parent.variableAttributes.find((parentAttrId) => parentAttrId === attrId)) {
                        parent.variableAttributes.push(attrId)
                    }
                })

                variation.variableAttributeValues.forEach((attrValueId) => {
                    if (!parent.variableAttributeValues.find((parentAttrValueId) => parentAttrValueId === attrValueId)) {
                        parent.variableAttributeValues.push(attrValueId)
                    }
                })

                variation.variableAttributes = []
                variation.variableAttributeValues = []

                await this._productRepository.update(
                    new UpdateRequest<Product>({
                        id: variation.id,
                        update: variation,
                        unsafeArrayUpdates: true
                    })
                )

                await this._productRepository.update(
                    new UpdateRequest<Product>({
                        id: parent.id,
                        update: parent,
                        unsafeArrayUpdates: true
                    })
                )
            }

            // Fill out taxonomy terms.

            const discTypes = [
                'disc-type-putters',
                'disc-type-mid-ranges',
                'disc-type-fairway-drivers',
                'disc-type-distance-drivers',
            ]

            for (let i = 0; i < discTypes.length; i++) {
                const slug = discTypes[i]
                const discType = await this._taxonomyTermRepository.lookup('slug', slug)
                const partialSlug = slug.replace('disc-type-', '')
                const name = titleize(partialSlug.replace(/-/g, ' '))
                const singularName = singularize(name)
                const pluralName = pluralize(name)

                if (discType) {
                    await this._taxonomyTermRepository.update(
                        new UpdateRequest<TaxonomyTerm>({
                            id: discType.id,
                            update: {
                                singularName,
                                pluralName,
                                pageSettings: {
                                    banner: `/page-images/${partialSlug}-banner.jpg`,
                                    bannerOverlay: `/page-images/${slug}.png`,
                                },
                            }
                        })
                    )
                }
            }

            const brands = [
                'brand-mvp-disc-sports',
                'brand-axiom-discs',
                'brand-discraft',
            ]

            for (let i = 0; i < brands.length; i++) {
                const slug = brands[i]
                const brand = await this._taxonomyTermRepository.lookup('slug', slug)
                const partialSlug = slug.replace('brand-', '')
                let brandName = titleize(partialSlug.substring(0, partialSlug.indexOf('-')))
                let name = titleize(partialSlug.replace(/-/g, ' '))
                if (slug === 'brand-mvp-disc-sports') {
                    brandName = 'MVP Disc Sports'
                    name = 'MVP'
                }
                if (slug === 'brand-axiom-discs') {
                    brandName = 'Axiom'
                    name = 'Axiom'
                }
                const singularName = singularize(name)
                const pluralName = `${brandName} Discs`

                if (brand) {
                    await this._taxonomyTermRepository.update(
                        new UpdateRequest<TaxonomyTerm>({
                            id: brand.id,
                            update: {
                                singularName,
                                pluralName,
                                pageSettings: {
                                    banner: `/page-images/${partialSlug}-banner.jpg`,
                                    bannerOverlay: `/page-images/${slug}.png`,
                                },
                            }
                        })
                    )
                }
            }

            return allProducts
        }
        catch (error) {
            throw error
        }
        /**/
    }
}
