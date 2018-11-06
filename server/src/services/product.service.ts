import { Response } from 'express'
import { inject, injectable } from 'inversify'

import { Attribute } from '@mte/common/api/entities/attribute'
import { AttributeValue } from '@mte/common/api/entities/attribute-value'
import { Order } from '@mte/common/api/entities/order'
import { Organization } from '@mte/common/api/entities/organization'
import { Product } from '@mte/common/api/entities/product'
import { Taxonomy } from '@mte/common/api/entities/taxonomy'
import { TaxonomyTerm } from '@mte/common/api/entities/taxonomy-term'
import { Price } from '@mte/common/api/interfaces/price'
import { GetProductsFilterType, GetProductsFromIdsRequest, GetProductsRequest } from '@mte/common/api/requests/get-products.request'
import { ListFromQueryRequest, ListRequest } from '@mte/common/api/requests/list.request'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { ApiResponse } from '@mte/common/api/responses/api.response'
import { GetProductDetailResponseBody } from '@mte/common/api/responses/get-product-detail/get-product-detail.response.body'
import { HttpStatus } from '@mte/common/constants'
import { Currency } from '@mte/common/constants/enums/currency'
import { RangeLimit } from '@mte/common/constants/enums/range-limit'
import { Types } from '@mte/common/constants/inversify/types'
import { ProductHelper } from '@mte/common/helpers/product.helper'
import { DbClient } from '../data-access/db-client'
import { ProductSearchHelper } from '../helpers/product-search.helper'
import { CrudService } from './crud.service'
import { OrganizationService } from './organization.service'

/**
 * Methods for querying the `products` collection
 *
 * TODO:
 * - Write simple method for querying related products
 * -- *Simple match* on one or more attributes/taxonomies (in this case probably brand and stability)
 * -- Those that match all go first, those that match all but one go next, etc.
 *
 * @export
 * @class ProductService
 * @extends {CrudService<Product>}
 */
@injectable()
export class ProductService extends CrudService<Product> {

    protected model = Product
    protected searchRequestType = GetProductsRequest
    protected listFromIdsRequestType = GetProductsFromIdsRequest

    constructor(
        @inject(Types.DbClient) protected dbClient: DbClient<Product>,
        @inject(Types.ProductSearchHelper) private productSearchHelper: ProductSearchHelper,
        @inject(Types.OrganizationService) private organizationService: OrganizationService,
    ) {
        super()
    }

    /**
     * Get a single product by slug.
     *
     * @param {string} slug The `slug` of the product to be retrieved
     * @return {Promise<Product>}
     */
    public getOneSlug(slug: string): Promise<ApiResponse<Product>> {
        return new Promise<ApiResponse<Product>>(async (resolve, reject) => {
            try {
                const product = await this.dbClient.findOne(Product, { slug })
                resolve(new ApiResponse(product))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }

    /**
     * Get a fully populated product by slug.
     *
     * @param {string} slug The `slug` of the product to be retrieved
     * @return {Promise<GetProductDetailResponseBody>}
     */
    public getProductDetail(slug: string): Promise<ApiResponse<GetProductDetailResponseBody>> {
        return new Promise<ApiResponse<GetProductDetailResponseBody>>(async (resolve, reject) => {
            try {
                const product = await this.dbClient.findOne(Product, { slug }, [
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

                resolve(new ApiResponse(product))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }

    /**
     * Get an unfiltered list of parent & standalone products,
     * or use a search/filter query
     *
     * @param {GetProductsRequest} body The search options
     * @param {express.Response} [res] The express Response; pass this in if you want the documents fetched as a stream and piped into the response
     */
    public async getProducts(body?: GetProductsRequest, res?: Response): Promise<ApiResponse<Product[]>|void> {
        const listFromQueryRequest = await this._createGetProductsRequestQuery(body)

        const populates = [
            'taxonomyTerms',
            'attributeValues', // TODO: Might not be necessary, maybe remove.
            'variableAttributeValues', // TODO: Might not be necessary, maybe remove.
        ]

        if (res) { // Stream the products.
            this.dbClient.findQuery(Product, listFromQueryRequest, res, populates)
            return
        }
        else { // Retrieve the products normally, loading them into memory.
            try {
                const products = await this.dbClient.findQuery(Product, listFromQueryRequest, null, populates)
                return new ApiResponse(products)
            }
            catch (error) {
                throw new ApiErrorResponse(error)
            }
        }
    }

    public async getPriceRangeForRequest(body: GetProductsRequest): Promise<ApiResponse<Price[]>> {
        const listFromQueryRequest = await this._createGetProductsRequestQuery(body)
        listFromQueryRequest.skip = 0
        listFromQueryRequest.limit = 0
        try {
            const products = await this.dbClient.findQuery(Product, listFromQueryRequest)
            const _priceRange = products.reduce<Price[]>((priceRange, product) => {
                const price = ProductHelper.getPrice(product)
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
                { amount: 0, currency: Currency.USD },
                { amount: 0, currency: Currency.USD },
            ])
            return new ApiResponse(_priceRange)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async getPriceRangeForShop(): Promise<ApiResponse<Price[]>> {
        const getProductsRequest = new GetProductsRequest({
            skip: 0,
            limit: 0
        })
        return this.getPriceRangeForRequest(getProductsRequest)
    }

    public createOne(product: Product): Promise<ApiResponse<Product>> {
        return new Promise<ApiResponse<Product>>(async (resolve, reject) => {
            try {
                const newProduct = await new Product(product).save() as Product
                resolve(new ApiResponse(newProduct._doc))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }

    public create(products: Product[]): Promise<ApiResponse<Product[]>> {
        return new Promise<ApiResponse<Product[]>>(async (resolve, reject) => {
            try {
                const newProducts = await this.dbClient.create(Product, products) as Product[]
                resolve(new ApiResponse(newProducts))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }

    public deleteOne(id: string): Promise<ApiResponse<any>> {
        return new Promise<ApiResponse<any>>(async (resolve, reject) => {
            try {
                await this.dbClient.delete(Product, id)
                resolve(new ApiResponse({}, HttpStatus.SUCCESS_NO_CONTENT))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }

    public updateInventory(products: Product[], order: Order): Promise<Product[]> {
        const productPromises: Promise<Product>[] = []

        products.forEach((product) => {
            productPromises.push(
                new Promise<Product>(async (resolve, reject) => {
                    let qty = 0
                    if (product.isParent) {
                        const variations = products.filter((p) => p.parentSku === product.sku)
                        const variationSkus = variations.map((v) => v.sku)
                        const orderVariations = order.items.filter((op: Product) => variationSkus.indexOf(op.sku) > -1)
                        qty = orderVariations.length
                    }
                    else {
                        const orderItems = order.items.filter((op: Product) => op.sku === product.sku) as Product[]
                        qty = orderItems.length
                    }

                    try {
                        let newStockQuantity = Math.floor((product.stockQuantity || 0) - qty)
                        if (newStockQuantity <= 0) {
                            newStockQuantity = 0
                        }
                        const newTotalSales = Math.floor((product.totalSales || 0) + qty)
                        const updatedProductResponse = await this.updateOne(product._id, {
                            stockQuantity: newStockQuantity,
                            totalSales: newTotalSales,
                        })
                        const updatedProduct = updatedProductResponse.body
                        resolve(updatedProduct)
                    }
                    catch (errorResponse) {
                        reject(errorResponse)
                    }
                })
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
                const parentProduct = await this.dbClient.findOne(Product, { sku: product.parentSku })
                parentProducts.push(parentProduct)
            }
        }
        return parentProducts
    }

    public async getParentProduct(product: Product): Promise<Product> {
        if (!product.isVariation) {
            return null
        }
        return this.dbClient.findOne(Product, { sku: product.parentSku }, [
            'variableAttributes',
            'variableAttributeValues',
        ])
    }

    // Helpers.

    public getPrice(product: Product): Price | Price[] {
        return ProductHelper.getPrice(product)
    }

    public determinePrice(product: Product): Price | Price[] {
        return ProductHelper.getPrice(product)
    }


    // FOR TESTING.

    public updateTestProduct(update: any): Promise<ApiResponse<Product>> {
        return this.updateOne('5988d5f44b224b068cda7d61', update)
    }

    public createTest(): Promise<ApiResponse<Product>> {
        return new Promise<ApiResponse<Product>>(async (resolve, reject) => {
            const theProduct = new Product({
                name: 'Test product',
                slug: 'test-product',
                sku: 'TEST_1',
            })
            try {
                const product = await theProduct.save() as Product
                resolve(new ApiResponse(product._doc))
            }
            catch (error) {
                reject(new ApiErrorResponse(error))
            }
        })
    }

    private async _createGetProductsRequestQuery(body: GetProductsRequest): Promise<ListFromQueryRequest> {
        const {
            limit,
            skip,
            search,
            filters,
            sortBy,
            sortDirection,
        } = new GetProductsRequest(body)
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
                organization = (await this.organizationService.getOrganization()).body
                const searchableTaxonomiesQuery = {
                    taxonomy: { $in: organization.searchableTaxonomies },
                    name: { $regex: searchRegExp },
                    slug: { $regex: searchRegExp },
                }
                taxonomyTermIdsToSearch = (await this.dbClient.findQuery<TaxonomyTerm>(TaxonomyTerm, new ListFromQueryRequest({ query: searchableTaxonomiesQuery })))
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

        // If there are filters, convert each filter to MongoDB query syntax and add it to `searchQuery.$and`.

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

                if (filter.type === GetProductsFilterType.Property) {
                    searchQuery = this.productSearchHelper.propertyFilter(filter, searchQuery)
                }

                // Simple Attribute Value Filter - performs an `$elemMatch` on `Product.simpleAttributeValues` and `Product.variableSimpleAttributeValues`.

                if (filter.type === GetProductsFilterType.SimpleAttributeValue) {
                    searchQuery = this.productSearchHelper.simpleAttributeValueFilter(filter, searchQuery)
                }

                // Attribute Value Filter - performs an `$or` query on `Product.attributeValues` and `Product.variableAttributeValues`.

                if (filter.type === GetProductsFilterType.AttributeValue) {
                    searchQuery = this.productSearchHelper.attributeValueFilter(filter, searchQuery)
                }

                // Taxonomy Filter - performs an `$or` query on `Product.taxonomyTerms`.
                    // Note: here we're using `slug`s rather than `id`s so that all the front end needs
                    // to provide is the `slug`. For AttributeValues, we're fetching them in order to display
                    // them anyway, so providing the `id` is easier.

                if (filter.type === GetProductsFilterType.TaxonomyTerm) {
                    const taxonomyTerms = await this.dbClient.findQuery<TaxonomyTerm>(TaxonomyTerm, {
                        query: { slug: { $in: filter.values } }
                    })
                    const taxonomyTermIds = taxonomyTerms ? taxonomyTerms.map((term) => term._id) : []
                    searchQuery = this.productSearchHelper.taxonomyTermFilter(taxonomyTermIds, searchQuery)
                }
            }
        }

        query = allQuery || searchQuery

        return new ListFromQueryRequest({
            limit,
            skip,
            sortBy,
            sortDirection,
            query
        })
    }
}
