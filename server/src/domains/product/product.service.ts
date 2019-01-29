import { Inject } from '@nestjs/common'
import { ListRequest } from '@qb/common/domains/data-access/requests/list.request'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import { ApiErrorResponse } from '@qb/common/domains/data-access/responses/api-error.response'
import { Currency } from '@qb/common/constants/enums/currency'
import { RangeLimit } from '@qb/common/constants/enums/range-limit'
import { Order } from '@qb/common/domains/order/order'
import { Organization } from '@qb/common/domains/organization/organization'
import { Price } from '@qb/common/domains/price/price'
import { Product } from '@qb/common/domains/product/product'
import { ProductListFilterType } from '@qb/common/domains/product/product-list-filter'
import { getPrice } from '@qb/common/helpers/product.helpers'
import { ObjectID } from 'typeorm'
import { OrganizationService } from '../organization/organization.service'
import { attributeValueFilter, propertyFilter, simpleAttributeValueFilter, taxonomyTermFilter } from '../product/product.helpers'
import { TaxonomyTermRepository } from '../taxonomy-term/taxonomy-term.repository'
import { ProductListRequest } from './product.list-request'
import { ProductRepository } from './product.repository'

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
        @Inject(ProductRepository) private _productRepository: ProductRepository,
        @Inject(TaxonomyTermRepository) private _taxonomyTermRepository: TaxonomyTermRepository,
        @Inject(OrganizationService) private _organizationService: OrganizationService,
    ) { }

    /**
     * Get a single product by slug.
     *
     * @param {string} slug The `slug` of the product to be retrieved
     * @return {Promise<Product>}
     */
    public getOneSlug(slug: string): Promise<Product | undefined> {
        return this._productRepository.lookup('slug', slug)
    }

    /**
     * Get a fully populated product by slug.
     */
    public async getProductDetail(slug: string): Promise<Product | undefined> {
        return this._productRepository.lookup('slug', slug)
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

    public updateInventory(products: Product[], order: Order): Promise<Product[]> {
        const productPromises: Promise<Product>[] = []

        products.forEach((product) => {
            let qty = 0
            if (product.isParent) {
                const variations = products.filter((p) => p.parentSku === product.sku)
                const variationSkus = variations.map((v) => v.sku)
                const orderVariations = order.products.filter(
                    (op: Product) => variationSkus.indexOf(op.sku) > -1
                )
                qty = orderVariations.length
            }
            else {
                const orderProducts = order.products.filter(
                    (op: Product) => op.sku === product.sku
                ) as Product[]
                qty = orderProducts.length
            }

            let newStockQuantity = Math.floor((product.stockQuantity || 0) - qty)
            if (newStockQuantity <= 0) {
                newStockQuantity = 0
            }
            const newTotalSales = Math.floor((product.totalSales || 0) + qty)
            productPromises.push(
                this._productRepository.update(
                    new UpdateRequest<Product>({
                        id: product.id,
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

    public async getParentProducts(products: Product[]): Promise<Product[]> {
        const parentProducts: Product[] = []
        for (const product of products) {
            if (!product.isVariation) {
                continue
            }
            if (!parentProducts.find((_parentProduct) => _parentProduct.sku === product.parentSku)) {
                const parentProduct = await this._productRepository
                    .lookup('sku', product.parentSku) as Product
                parentProducts.push(parentProduct)
            }
        }
        return parentProducts
    }

    public async getParentProduct(product: Product): Promise<Product | undefined> {
        if (!product.isVariation) {
            return undefined
        }
        return this._productRepository.lookup('sku', product.parentSku)
    }

    // Helpers.

    public getPrice(product: Product): Price | Price[] {
        return getPrice(product)
    }

    public determinePrice(product: Product): Price | Price[] {
        return getPrice(product)
    }

    private async _createProductListRequestQuery(body: ProductListRequest): Promise<ListRequest<Product>> {
        const {
            limit,
            skip,
            search,
            filters,
            sortBy,
            sortDirection,
        } = new ProductListRequest(body)
        let taxonomyTermIdsToSearch: ObjectID[]
        const searchRegExp = search ? new RegExp(search, 'gi') : undefined
        const searchOr: {
            $or: {
                [key: string]: { $regex: RegExp } | { $in: ObjectID[] }
            }[]
        } = { $or: [] }
        let allQuery: any
        let searchQuery: { $and: object[] } = { $and: [] }
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
                taxonomyTermIdsToSearch = (await this._taxonomyTermRepository.list(new ListRequest({ query: searchableTaxonomiesQuery })))
                    .map((taxonomyTerm) => taxonomyTerm.id)
            }
            catch (error) {
                throw error
            }

            // Add the regex queries for name, description, and taxonomy.
            searchOr.$or.push({ name: { $regex: searchRegExp } })
            searchOr.$or.push({ description: { $regex: searchRegExp } })
            searchOr.$or.push({ taxonomyTerms: { $in: taxonomyTermIdsToSearch } })

            // @ts-ignore
            if (searchQuery) {
                searchQuery.$and.push(searchOr)
            }
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
                    const taxonomyTerms = await this._taxonomyTermRepository.list(
                        new ListRequest({
                            query: { slug: { $in: filter.values } }
                        })
                    )
                    const taxonomyTermIds = taxonomyTerms ? taxonomyTerms.map((term) => term.id) : []
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
