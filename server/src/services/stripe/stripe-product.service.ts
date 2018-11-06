import { inject, injectable } from 'inversify'
import * as Stripe from 'stripe'

import { Attribute } from '@mte/common/api/entities/attribute'
import { AttributeValue } from '@mte/common/api/entities/attribute-value'
import { Price } from '@mte/common/api/entities/price'
import { Product } from '@mte/common/api/entities/product'
import { SimpleAttributeValue } from '@mte/common/api/entities/simple-attribute-value'
import { Copy } from '@mte/common/constants/copy'
import { Types } from '@mte/common/constants/inversify/types'
import { ProductService } from '../product.service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Stripe service
 *
 * @export
 * @class StripeProductService
 * @description Methods for interacting with the Stripe Products API
 */
@injectable()
export class StripeProductService {

    constructor(
        @inject(Types.ProductService) private productService: ProductService,
    ) { }

    public async createProducts(products: Product[]): Promise<Stripe.products.IProduct[]> {
        if (products.some((product) => product.isVariation)) {
            throw new Error('Attempted to create Stripe products from product variations.')
        }
        if (!products || !products.length || products.every((product) => product.existsInStripe)) {
            return []
        }
        if (products.some((product) => product.stockQuantity === 0)) {
            throw new Error(Copy.ErrorMessages.itemOutOfStockError)
        }
        const stripeProducts: Stripe.products.IProduct[] = []
        try {
            for (const dbProduct of products) {
                if (dbProduct.existsInStripe) {
                    continue
                }
                try {
                    const stripeProduct = await stripe.products.create(
                        this._getProductCreationOptionsFromProduct(dbProduct)
                    )
                    stripeProducts.push(stripeProduct)
                }
                catch (error) {
                    if (error.message.indexOf('exists') > -1) {
                        continue
                    } else {
                        throw error
                    }
                }
            }
            return stripeProducts
        }
        catch (error) {
            throw error
        }
    }

    public async createSkus(products: Product[]): Promise<Stripe.skus.ISku[]> {
        if (products.some((product) => product.isParent)) {
            throw new Error('Attempted to create Stripe skus from parent products.')
        }
        if (!products || !products.length || products.every((product) => product.existsInStripe)) {
            return []
        }
        if (products.some((product) => product.stockQuantity === 0)) {
            throw new Error(Copy.ErrorMessages.itemOutOfStockError)
        }

        const stripeSkus: Stripe.skus.ISku[] = []
        try {
            for (const dbProduct of products.filter((product) => !product.existsInStripe)) {
                try {
                    const parentProduct = await this.productService.getParentProduct(dbProduct)
                    const skuCreationOptions = this._getSkuCreationOptionsFromProduct(dbProduct, parentProduct)
                    const stripeSku = await stripe.skus.create(skuCreationOptions)
                    stripeSkus.push(stripeSku)
                }
                catch (error) {
                    if (error.message.indexOf('exists') > -1) {
                        continue
                    } else {
                        throw error
                    }
                }
            }

            return stripeSkus
        }
        catch (error) {
            throw error
        }
    }

    private _getProductCreationOptionsFromProduct(product: Product): Stripe.products.IProductCreationOptions {
        return {
            id: product.sku,
            name: product.name,
            description: product.description,
            type: 'good',
            attributes: [
                ...product.variableAttributes.map((attribute: Attribute) => attribute.slug),
                ...product.variableProperties,
            ]
        }
    }

    private _getSkuCreationOptionsFromProduct(
        product: Product,
        parentProduct: Product,
    ): Stripe.skus.ISkuCreationOptions {
        const priceAmount = (this.productService.determinePrice(product) as Price).amount
        const attributeDictionary: Stripe.skus.ISkuAttributes = {}

        parentProduct.variableAttributes.forEach((variableAttribute: Attribute) => {
            let attributeValue: AttributeValue | SimpleAttributeValue = product.attributeValues
                .find((_attributeValue: AttributeValue) =>
                    _attributeValue.attribute.toString() === variableAttribute._id.toString()) as AttributeValue
            if (!attributeValue) {
                attributeValue = product.simpleAttributeValues.find((_simpleAttributeValue) =>
                    _simpleAttributeValue.attribute.toString() === variableAttribute._id.toString())
            }
            if (attributeValue) {
                attributeDictionary[variableAttribute.slug] = attributeValue.value
            }
        })

        parentProduct.variableProperties.forEach((variableProperty) => {
            let value = product[variableProperty]
            if (typeof value === 'object') {
                if (!!value.amount) {
                    value = value.amount
                }
            }
            attributeDictionary[variableProperty] = value
        })

        return {
            id: product.sku,
            product: product.parentSku,
            currency: product.price.currency,
            inventory: {
                quantity: product.stockQuantity,
                type: 'finite',
            },
            // Stripe stores price in the lowest currency denomination.
            // By multiplying by 100 (cents), we're assuming USD.
            price: priceAmount * 100,
            attributes: attributeDictionary,
        }
    }
}
