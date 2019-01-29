import { Inject, Injectable } from '@nestjs/common'
import { Attribute } from '@qb/common/domains/attribute/attribute'
import { AttributeValue } from '@qb/common/domains/attribute-value/attribute-value'
import { Price } from '@qb/common/domains/price/price'
import { Product } from '@qb/common/domains/product/product'
import { SimpleAttributeValue } from '@qb/common/domains/simple-attribute-value/simple-attribute-value'
import { Copy } from '@qb/common/constants/copy'
import * as Stripe from 'stripe'
import { ProductService } from '../../product/product.service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

/**
 * Stripe service
 *
 * @export
 * @class StripeProductService
 * @description Methods for interacting with the Stripe Products API
 */
@Injectable()
export class StripeProductService {

  constructor(
    @Inject(ProductService) private productService: ProductService,
  ) { }

  public async createProducts(products: Product[]):
    Promise<Stripe.products.IProduct[]> {
    if (products.some((product) => product.isVariation)) {
      throw new Error(
        'Attempted to create Stripe products from product variations.'
      )
    }
    if (!products ||
      !products.length ||
      products.every((product) => product.existsInStripe)
    ) {
      return []
    }
    if (products.some((product) => product.stockQuantity === 0)) {
      throw new Error(Copy.ErrorMessages.productOutOfStockError)
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
    if (
      !products ||
      !products.length ||
      products.every((product) => product.existsInStripe)
    ) {
      return []
    }
    if (products.some((product) => product.stockQuantity === 0)) {
      throw new Error(Copy.ErrorMessages.productOutOfStockError)
    }

    const stripeSkus: Stripe.skus.ISku[] = []
    try {
      for (const dbProduct of products.filter((product) => !product.existsInStripe)) {
        try {
          const parentProduct = await this.productService.getParentProduct(dbProduct) as Product
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
    const attributeDictionary: Stripe.skus.ISkuAttributes = {};

    (parentProduct.variableAttributes as Attribute[]).forEach((variableAttribute: Attribute) => {
      let attributeValue: AttributeValue | SimpleAttributeValue | undefined =
        (product.attributeValues as AttributeValue[]).find(
          (_attributeValue: AttributeValue) =>
            _attributeValue.attribute.toString() ===
            variableAttribute.id.toString()
        )

      if (!attributeValue) {
        attributeValue = product.simpleAttributeValues.find((_simpleAttributeValue) =>
          _simpleAttributeValue.attribute.toString() === variableAttribute.id.toString())
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
