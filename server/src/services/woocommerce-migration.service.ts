import { pluralize, singularize, titleize } from 'inflection'
import { inject, injectable } from 'inversify'
import { camelCase, cloneDeep, kebabCase } from 'lodash'

import { Attribute } from '@mte/common/api/entities/attribute'
import { AttributeValue } from '@mte/common/api/entities/attribute-value'
import { Image } from '@mte/common/api/entities/image'
import { Price } from '@mte/common/api/entities/price'
import { Product } from '@mte/common/api/entities/product'
import { Taxonomy } from '@mte/common/api/entities/taxonomy'
import { TaxonomyTerm } from '@mte/common/api/entities/taxonomy-term'
import { ListFromIdsRequest, ListFromQueryRequest } from '@mte/common/api/requests/list.request'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { ApiResponse } from '@mte/common/api/responses/api.response'
import { Currency } from '@mte/common/constants/enums/currency'
import { ProductClass } from '@mte/common/constants/enums/product-class'
import { RangeLimit } from '@mte/common/constants/enums/range-limit'
import { WeightUnit } from '@mte/common/constants/enums/weight-unit'
import { Types } from '@mte/common/constants/inversify/types'
import { DbClient } from '../data-access/db-client'

import * as productsJSON from '@mte/common/work-files/migration/hyzershop-products'

@injectable()
export class WoocommerceMigrationService {

    @inject(Types.DbClient) private dbClient: DbClient<any>

    public createProductsFromExportedJSON(): Promise<ApiResponse<Product[]>> {
        return new Promise<ApiResponse<Product[]>>(async (resolve, reject) => {
            const newProducts = []

            const dropAllProductRelatedCollections = async () => {
                await this.dbClient.remove(Product, {})
                await this.dbClient.remove(Attribute, {})
                await this.dbClient.remove(AttributeValue, {})
                await this.dbClient.remove(Taxonomy, {})
                await this.dbClient.remove(TaxonomyTerm, {})
            }

            await dropAllProductRelatedCollections()

            const buildProducts = async () => {
                for (const product of productsJSON) {
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

                    const variableAttributeIds: string[] = []
                    const variableAttributeValueIds: string[] = []
                    const attributeValueIds: string[] = []
                    const simpleAttributeValues: { attribute: string, value: any }[] = []
                    const taxonomyTermIds: string[] = []

                    const flightStats: {
                        fade: number
                        glide: number
                        speed: number
                        turn: number
                    } = {
                        fade: undefined,
                        glide: undefined,
                        speed: undefined,
                        turn: undefined,
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
                                                const variableAttribute = await this.dbClient.findOrCreate(Attribute, {
                                                    slug: variableAttributeSlug
                                                })
                                                variableAttributeIds.push(variableAttribute._id)
                                                for (const variableAttributeValueSlug of variableAttributeValueSlugs) {
                                                    try {
                                                        const variableAttributeValue = await this.dbClient.findOrCreate(AttributeValue, {
                                                            attribute: variableAttribute._id,
                                                            slug: variableAttributeValueSlug,
                                                            value: variableAttributeValueValues[variableAttributeValueSlugs.indexOf(variableAttributeValueSlug)],
                                                        })
                                                        variableAttributeValueIds.push(variableAttributeValue._id)
                                                    }
                                                    catch (error) {
                                                        reject(new ApiErrorResponse(error))
                                                    }
                                                }
                                            }
                                            catch (error) {
                                                reject(new ApiErrorResponse(error))
                                                return
                                            }
                                        }
                                        else {
                                            const value = newProduct[key]
                                            const attributeValueSlug = kebabCase(theKey + '-' + newProduct[key].replace(/\s/g, '-').replace(/[\(\)]/g, '').toLowerCase())
                                            const attributeSlug = kebabCase(theKey)
                                            try {
                                                const attribute = await this.dbClient.findOrCreate(Attribute, {
                                                    slug: attributeSlug
                                                })
                                                const attributeValue = await this.dbClient.findOrCreate(AttributeValue, {
                                                    attribute: attribute._id,
                                                    slug: attributeValueSlug,
                                                    value,
                                                })
                                                attributeValueIds.push(attributeValue._id)
                                                delete newProduct[key]
                                            }
                                            catch (error) {
                                                reject(new ApiErrorResponse(error))
                                                return
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

                                const speedGlideTurnFadeAttribute = await this.dbClient.findOrCreate(Attribute, { slug: key })
                                simpleAttributeValues.push({
                                    attribute: speedGlideTurnFadeAttribute._id,
                                    value: flightStats[key]
                                })

                                // Add stability AttributeValue and TaxonomyTerm.

                                const getStability = function(stabilityStats): 'overstable'|'stable'|'understable' {
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

                                        const attribute = await this.dbClient.findOrCreate(Attribute, {
                                            slug: attributeSlug,
                                        })
                                        const attributeValue = await this.dbClient.findOrCreate(AttributeValue, {
                                            attribute: attribute._id,
                                            slug: attributeValueSlug,
                                            value: stabilityValue,
                                        })
                                        attributeValueIds.push(attributeValue._id)

                                        const taxonomy = await this.dbClient.findOrCreate(Taxonomy, {
                                            slug: taxonomySlug,
                                        })
                                        const taxonomyTerm = await this.dbClient.findOrCreate(TaxonomyTerm, {
                                            taxonomy: taxonomy._id,
                                            slug: taxonomyTermSlug,
                                        })
                                        taxonomyTermIds.push(taxonomyTerm._id)
                                    }
                                    catch (error) {
                                        reject(new ApiErrorResponse(error))
                                        return
                                    }
                                }
                            }

                            if (key === 'inboundsId') {
                                const inboundsIdAttribute = await this.dbClient.findOrCreate(Attribute, { slug: kebabCase(key) })
                                simpleAttributeValues.push({
                                    attribute: inboundsIdAttribute._id,
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
                                    const taxonomy = await this.dbClient.findOrCreate(Taxonomy, { slug: taxonomySlug })

                                    taxonomyTermSlugs.forEach((taxonomyTermSlug) => {
                                        taxonomyTermPromises.push(this.dbClient.findOrCreate(TaxonomyTerm, {
                                            taxonomy: taxonomy._id,
                                            slug: taxonomyTermSlug
                                        }))
                                    })

                                    const taxonomyTerms = await Promise.all(taxonomyTermPromises)

                                    taxonomyTerms.forEach((taxonomyTerm) => taxonomyTermIds.push(taxonomyTerm._id))
                                    newProduct.taxonomyTermSlugs = taxonomyTermSlugs

                                    delete newProduct[key]
                                }
                                catch (error) {
                                    reject(new ApiErrorResponse(error))
                                    return
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
                                    newProduct.salePriceRange[RangeLimit.Min].amount = parseFloat(salePriceRangeTotals[RangeLimit.Min])
                                    newProduct.salePriceRange[RangeLimit.Max].amount = parseFloat(salePriceRangeTotals[RangeLimit.Max])
                                    delete newProduct.salePrice
                                }
                                else {
                                    newProduct.salePrice = {
                                        amount: +newProduct[key],
                                        currency: Currency.USD
                                    } as Price
                                }
                            }

                            if (key === 'type') {
                                if ((newProduct as any).type === 'Variable') {
                                    newProduct.isParent = true
                                    newProduct.class = ProductClass.Parent
                                }
                                if ((newProduct as any).type === 'Variation') {
                                    newProduct.isVariation = true
                                    newProduct.class = ProductClass.Variation
                                }
                                if ((newProduct as any).type === 'Simple Product') {
                                    newProduct.isStandalone = true
                                    newProduct.class = ProductClass.Standalone
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

                    newProduct.variableAttributes = variableAttributeIds
                    newProduct.variableAttributeValues = variableAttributeValueIds
                    newProduct.attributeValues = attributeValueIds
                    newProduct.simpleAttributeValues = simpleAttributeValues
                    newProduct.taxonomyTerms = taxonomyTermIds

                    delete (<any>newProduct).images
                    delete (<any>newProduct).featuredImage
                    delete (<any>newProduct).thumbnail

                    newProducts.push(newProduct)
                }
            }

            try {
                await buildProducts()
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
                return
            }

            /*************
             * The switch
             ******* -> */
            try {
                const allProducts = await this.dbClient.create<Product>(Product, newProducts)
                const parentProducts = allProducts.filter((p) => p.isParent)
                const variationProducts = allProducts.filter((p) => p.isVariation)

                // Populate the `variations` array.

                for (let i = 0; i < parentProducts.length; i++) {
                    const parentProduct = parentProducts[i]
                    const variations = allProducts.filter((p) => p.parentSku === parentProduct.sku)
                    parentProduct.variations = variations.map((v) => v._id)
                    await parentProduct.save()
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
                            product.taxonomyTermSlugs.forEach(term => {
                                if (term.indexOf('brand') === 0) {
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
                            attributeValues = await this.dbClient.findIds(AttributeValue, new ListFromIdsRequest({ ids: product.attributeValues })) as AttributeValue[]
                            taxonomyTerms = await this.dbClient.findIds(TaxonomyTerm, new ListFromIdsRequest({ ids: product.taxonomyTerms }))
                            isDisc = taxonomyTerms && taxonomyTerms.some((taxTerm) => taxTerm.slug === 'product-type-discs')
                        }
                        catch (error) {
                            reject(new ApiErrorResponse(error))
                            return
                        }

                        const name = product.name.substr(0, product.name.indexOf(' -'))
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

                        const productImage: Image = {
                            large: imageBaseUrl + '-large.png',
                            medium: imageBaseUrl + '-medium.png',
                            thumbnail: imageBaseUrl + '-thumbnail.png',
                        }

                        product.featuredImages.push(productImage)
                        product.images.push(productImage)
                    }

                    await product.save()
                }

                // Populate parent product images with variation images.

                for (let i = 0; i < parentProducts.length; i++) {
                    const product = parentProducts[i]
                    let variations = []
                    if (product.isParent) {
                        variations = allProducts.filter(p => product.sku === p.parentSku)
                        variations.forEach((pv) => {
                            product.featuredImages = product.featuredImages.concat(pv.featuredImages)
                            product.images = product.images.concat(pv.images)
                        })
                    }

                    await product.save()
                }

                // Populate parent products with variation attributes and attribute values.

                for (let i = 0; i < variationProducts.length; i++) {
                    const variation = variationProducts[i]
                    const parent = parentProducts.find((p) => p.sku === variation.parentSku)

                    if (!parent) {
                        throw new Error(`Could not find a parent for the product variation: ${JSON.stringify(variation)}`)
                    }

                    // Add the parent to the variation.
                    variation.parent = parent._id

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

                    await variation.save()
                    await parent.save()
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
                    const discType = await this.dbClient.findOne(TaxonomyTerm, { slug })
                    const partialSlug = slug.replace('disc-type-', '')
                    const name = titleize(partialSlug.replace(/-/g, ' '))
                    const singularName = singularize(name)
                    const pluralName = pluralize(name)

                    await this.dbClient.updateById(TaxonomyTerm, discType._id, {
                        singularName,
                        pluralName,
                        pageSettings: {
                            banner: `/page-images/${partialSlug}-banner.jpg`,
                            bannerOverlay: `/page-images/${slug}.png`,
                        },
                    })
                }

                const brands = [
                    'brand-mvp-disc-sports',
                    'brand-axiom-discs',
                    'brand-discraft',
                ]

                for (let i = 0; i < brands.length; i++) {
                    const slug = brands[i]
                    const brand = await this.dbClient.findOne(TaxonomyTerm, { slug })
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

                    await this.dbClient.updateById(TaxonomyTerm, brand._id, {
                        singularName,
                        pluralName,
                        pageSettings: {
                            banner: `/page-images/${partialSlug}-banner.jpg`,
                            bannerOverlay: `/page-images/${slug}.png`,
                        },
                    })
                }

                resolve(new ApiResponse(allProducts))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
            /**/
        })
    }
}
