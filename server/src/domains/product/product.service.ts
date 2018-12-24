import { Inject } from '@nestjs/common'
import { Attribute } from '@qb/common/api/entities/attribute'
import { AttributeValue } from '@qb/common/api/entities/attribute-value'
import { Product } from '@qb/common/api/entities/product'
import { Taxonomy } from '@qb/common/api/entities/taxonomy'
import { TaxonomyTerm } from '@qb/common/api/entities/taxonomy-term'
import { Order } from '@qb/common/api/interfaces/order'
import { Organization } from '@qb/common/api/interfaces/organization'
import { Price } from '@qb/common/api/interfaces/price'
import { Product as IProduct } from '@qb/common/api/interfaces/product'
import { TaxonomyTerm as ITaxonomyTerm } from '@qb/common/api/interfaces/taxonomy-term'
import { ListRequest } from '@qb/common/api/requests/list.request'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { ApiErrorResponse } from '@qb/common/api/responses/api-error.response'
import { Currency } from '@qb/common/constants/enums/currency'
import { RangeLimit } from '@qb/common/constants/enums/range-limit'
import { getPrice } from '@qb/common/helpers/product.helpers'
import { Response } from 'express'
import { QbRepository } from '../../shared/data-access/repository'
import { OrganizationService } from '../organization/organization.service'
import { attributeValueFilter, propertyFilter, simpleAttributeValueFilter, taxonomyTermFilter } from '../product/product.helpers'
import { ProductListRequest } from './product.list-request'
import { ProductListFilterType } from '@qb/common/api/requests/models/product-list-filter';

/**
 * Methods for querying the `products` collection
 *
 * TODO:
 * - Write simple method for querying related products
 * -- *Simple match* on one or more attributes/taxonomies (in this case probably brand and stability)
 * -- Those that match all go first, those that match all but one go next, etc.
 */
export class ProductService {

    constructor(
        @Inject(QbRepository) private _productRepository: QbRepository<IProduct>,
        @Inject(QbRepository) private _taxonomyTermsRepository: QbRepository<ITaxonomyTerm>,
        @Inject(OrganizationService) private _organizationService: OrganizationService,
    ) {
        this._productRepository.configureForGoosetypeEntity(Product)
        this._taxonomyTermsRepository.configureForGoosetypeEntity(TaxonomyTerm)
    }

    /**
     * Get a single product by slug.
     *
     * @param {string} slug The `slug` of the product to be retrieved
     * @return {Promise<Product>}
     */
    public getOneSlug(slug: string): Promise<IProduct> {
        return this._productRepository.lookup('slug', slug)
    }

    /**
     * Get a fully populated product by slug.
     */
    public async getProductDetail(slug: string): Promise<IProduct> {
        return this._productRepository.lookup('slug', slug, [
            {
                path: 'taxonomyTerms',
                model: TaxonomyTerm.getModel(),
                populate: {
                    path: 'taxonomy',
                    model: Taxonomy.getModel(),
                }
            },
            {
                path: 'simpleAttributeValues.attribute',
                model: Attribute.getModel(),
            },
            {
                path: 'attributeValues',
                model: AttributeValue.getModel(),
                populate: {
                    path: 'attribute',
                    model: Attribute.getModel(),
                },
            },
            {
                path: 'variableAttributes',
                model: Attribute.getModel(),
            },
            {
                path: 'variableAttributeValues',
                model: AttributeValue.getModel(),
                populate: {
                    path: 'attribute',
                    model: Attribute.getModel(),
                }
            },
            {
                path: 'variableSimpleAttributeValues.attribute',
                model: Attribute.getModel(),
            },
            {
                path: 'variations',
                populate: {
                    path: 'attributeValues',
                    model: AttributeValue.getModel(),
                    populate: {
                        path: 'attribute',
                        model: Attribute.getModel(),
                    }
                },
            },
            {
                path: 'variations.simpleAttributeValues.attribute',
                model: Attribute.getModel(),
            },
        ])
    }

    /**
     * Get an unfiltered list of parent & standalone products,
     * or use a search/filter query
     */
    public async getProducts(body: ProductListRequest, response: Response): Promise<void> {
        const listRequest = await this._createProductListRequestQuery(body)

        if (!listRequest.populates) {
            listRequest.populates = []
        }

        listRequest.populates = [
            ...listRequest.populates,
            'taxonomyTerms',
            'attributeValues', // TODO: Might not be necessary, maybe remove.
            'variableAttributeValues', // TODO: Might not be necessary, maybe remove.
        ]

        return this._productRepository.stream(listRequest, response)
    }

    public async getPriceRangeForShop(): Promise<Price[]> {
        const getProductsRequest = new ProductListRequest({
            skip: 0,
            limit: 0
        })
        const listRequest = await this._createProductListRequestQuery(getProductsRequest)
        try {
            const products = await this._productRepository.list(listRequest)
            const _priceRange = products.reduce<Price[]>((priceRange, product) => {
                const price = getPrice(product)
                if (Array.isArray(price)) {
                    if (priceRange[RangeLimit.Min].amount === 0 || price[RangeLimit.Min].amount < priceRange[RangeLimit.Min].amount) {
                        priceRange[RangeLimit.Min] = price[RangeLimit.Min]
                    }
                    if (price[RangeLimit.Max].amount > priceRange[RangeLimit.Max].amount) {
                        priceRange[RangeLimit.Max] = price[RangeLimit.Max]
                    }
                } else {
                    if (price.amount < priceRange[RangeLimit.Min].amount) {
                        priceRange[RangeLimit.Min] = price
                    }
                    if (price.amount > priceRange[RangeLimit.Max].amount) {
                        priceRange[RangeLimit.Max] = price
                    }
                }
                return priceRange
            }, [
                { amount: 0, currency: Currency.USD } as Price,
                { amount: 0, currency: Currency.USD } as Price,
            ])
            return _priceRange
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public updateInventory(products: IProduct[], order: Order): Promise<IProduct[]> {
        const productPromises: Promise<IProduct>[] = []

        products.forEach((product) => {
            let qty = 0
            if (product.isParent) {
                const variations = products.filter((p) => p.parentSku === product.sku)
                const variationSkus = variations.map((v) => v.sku)
                const orderVariations = order.items.filter((op: IProduct) => variationSkus.indexOf(op.sku) > -1)
                qty = orderVariations.length
            }
            else {
                const orderItems = order.items.filter((op: IProduct) => op.sku === product.sku) as IProduct[]
                qty = orderItems.length
            }

            let newStockQuantity = Math.floor((product.stockQuantity || 0) - qty)
            if (newStockQuantity <= 0) {
                newStockQuantity = 0
            }
            const newTotalSales = Math.floor((product.totalSales || 0) + qty)
            productPromises.push(
                this._productRepository.update(
                    new UpdateRequest({
                        id: product._id,
                        update: {
                            stockQuantity: newStockQuantity,
                            totalSales: newTotalSales,
                        }
                    })
                )
            )
        })

        return Promise.all(productPromises)
    }

    public async getParentProducts(products: IProduct[]): Promise<IProduct[]> {
        const parentProducts: IProduct[] = []
        for (const product of products) {
            if (!product.isVariation) {
                continue
            }
            if (!parentProducts.find((_parentProduct) => _parentProduct.sku === product.parentSku)) {
                const parentProduct = await this._productRepository.lookup('sku', product.parentSku)
                parentProducts.push(parentProduct)
            }
        }
        return parentProducts
    }

    public async getParentProduct(product: IProduct): Promise<IProduct> {
        if (!product.isVariation) {
            return null
        }
        return this._productRepository.lookup('sku', product.parentSku, [
            'variableAttributes',
            'variableAttributeValues',
        ])
    }

    // Helpers.

    public getPrice(product: IProduct): Price | Price[] {
        return getPrice(product)
    }

    public determinePrice(product: IProduct): Price | Price[] {
        return getPrice(product)
    }

    private async _createProductListRequestQuery(body: ProductListRequest): Promise<ListRequest<IProduct>> {
        const {
            limit,
            skip,
            search,
            filters,
            sortBy,
            sortDirection,
        } = new ProductListRequest(body)
        let taxonomyTermIdsToSearch: string[]
        const searchRegExp = search ? new RegExp(search, 'gi') : undefined
        const searchOr: {
            $or: {
                [key: string]: { $regex: RegExp } | { $in: string[] }
            }[]
        } = { $or: [] }
        let allQuery: any
        let searchQuery: { $and: object[] }
        let query: any

        // If it's a search or filter, create a basic `$and` query for parent and standalone products.

        if (search || filters) {
            searchQuery = {
                $and: [
                    { isVariation: { $ne: true } },
                ],
            }
        }

        // Else, display parent and standalone products unfiltered.

        else {
            allQuery = { isVariation: { $ne: true } }
        }

        // If there's a search:

        if (searchRegExp) {

            // Find taxonomy terms from the taxonomies defined by the organization as searchable.

            let organization: Organization
            try {
                organization = await this._organizationService.getOrganization()
                const searchableTaxonomiesQuery = {
                    taxonomy: { $in: organization.searchableTaxonomies },
                    name: { $regex: searchRegExp },
                    slug: { $regex: searchRegExp },
                }
                taxonomyTermIdsToSearch = (await this._taxonomyTermsRepository.list(new ListRequest({ query: searchableTaxonomiesQuery })))
                    .map((taxonomyTerm) => taxonomyTerm._id)
            }
            catch (error) {
                throw error
            }

            // Add the regex queries for name, description, and taxonomy.
            searchOr.$or.push({ name: { $regex: searchRegExp } })
            searchOr.$or.push({ description: { $regex: searchRegExp } })
            searchOr.$or.push({ taxonomyTerms: { $in: taxonomyTermIdsToSearch } })

            searchQuery.$and.push(searchOr)
        }

        // If there are filters, convert each filter to MongoDB query syntax and add it to
        // `searchQuery.$and`.

        if (filters) {
            for (let i = 0; i < filters.length; i++) {
                const filter = filters[i]

                if (
                    (!filter.values || !filter.values.length) &&
                    !filter.range
                ) {
                    continue
                }

                // Property Filter.

                if (filter.type === ProductListFilterType.Property) {
                    searchQuery = propertyFilter(filter, searchQuery)
                }

                // Simple Attribute Value Filter - performs an `$elemMatch` on `Product.simpleAttributeValues` and `Product.variableSimpleAttributeValues`.

                if (filter.type === ProductListFilterType.SimpleAttributeValue) {
                    searchQuery = simpleAttributeValueFilter(filter, searchQuery)
                }

                // Attribute Value Filter - performs an `$or` query on `Product.attributeValues` and `Product.variableAttributeValues`.

                if (filter.type === ProductListFilterType.AttributeValue) {
                    searchQuery = attributeValueFilter(filter, searchQuery)
                }

                // Taxonomy Filter - performs an `$or` query on `Product.taxonomyTerms`.
                    // Note: here we're using `slug`s rather than `id`s so that all the front end needs
                    // to provide is the `slug`. (For AttributeValues, the front end is fetching them
                    // in order to display them anyway, so providing the `id` is easy.)

                if (filter.type === ProductListFilterType.TaxonomyTerm) {
                    const taxonomyTerms = await this._taxonomyTermsRepository.list(
                        new ListRequest({
                            query: { slug: { $in: filter.values } }
                        })
                    )
                    const taxonomyTermIds = taxonomyTerms ? taxonomyTerms.map((term) => term._id) : []
                    searchQuery = taxonomyTermFilter(taxonomyTermIds, searchQuery)
                }
            }
        }

        query = allQuery || searchQuery

        return new ListRequest({
            limit,
            skip,
            sortBy,
            sortDirection,
            query
        })
    }
}
