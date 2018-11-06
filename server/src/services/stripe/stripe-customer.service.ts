import { inject, injectable } from 'inversify'
import * as Stripe from 'stripe'

import { Types } from '@mte/common/constants/inversify/types'
import { Order } from '@mte/common/api/entities/order'
import { User } from '@mte/common/api/entities/user'
import { ApiErrorResponse } from '@mte/common/api/responses/api-error.response'
import { ApiResponse } from '@mte/common/api/responses/api.response'
import { DbClient } from '../../data-access/db-client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Stripe service
 *
 * @export
 * @class StripeService
 * @description Methods for interacting with the Stripe API
 */
@injectable()
export class StripeCustomerService {

    @inject(Types.DbClient) private dbClient: DbClient<User>

    /**
     * If the customer checked "save payment info," create a Stripe Customer
     *
     * @param {Order} order - The order from which the customer's information is being collected
     */
    public async createCustomer(order: Order): Promise<Stripe.customers.ICustomer> {
        if (order.customer.userId && order.stripeToken && order.stripeToken.card) {
            let user: User
            try {
                user = await this.dbClient.findById(User, order.customer.userId)
            }
            catch (findUserError) {
                throw findUserError
            }
            if (!user) return null

            if (order.customer.stripeCustomerId) {
                try {
                    const customer = await stripe.customers.retrieve(order.customer.stripeCustomerId)
                    if (customer) {
console.log('===== The Stripe Customer =====')
console.log(customer)
                        return customer
                    }
                }
                catch (retrieveStripeCustomerError) {
                    throw retrieveStripeCustomerError
                }
            }

            // No customer was found; create the customer in Stripe.

            try {
                const customer = await stripe.customers.create({
                    source: order.stripeToken.id,
                    email: order.customer.email,
                })
                if (!customer) throw new Error('Couldn\'t create the customer in Stripe')

console.log('===== New customer =====')
console.log(customer)

                user.stripeCustomerId = customer.id
                await this.dbClient.save(user)
                return customer
            }
            catch (error) {
                throw error
            }
        } else {
            throw new Error('The order did not contain sufficient data to create a customer in Stripe.')
        }
    }

    /**
     * Add a card to the Stripe customer
     *
     * @param {string} source - The tokenized card
     * @param {string} stripeCustomerId - The Stripe customer's `id`
     */
    public async addCard(tokenID: string, stripeCustomerId: string): Promise<ApiResponse<Stripe.cards.ICard>> {
        try {
            const card = await stripe.customers.createSource(stripeCustomerId, { source: tokenID })
            return new ApiResponse(<Stripe.cards.ICard>card)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    /**
     * Get a Stripe customer
     *
     * @param {string} stripeCustomerId - The Stripe customer's `id`
     */
    public async getCustomer(customerId: string): Promise<ApiResponse<Stripe.customers.ICustomer>> {
        try {
            if (!customerId) {
                throw new Error('No Stripe customer is associated with this user.')
            }
            const customer = await stripe.customers.retrieve(customerId)
            return new ApiResponse(<Stripe.customers.ICustomer>customer)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    /**
     * Update a Stripe customer
     *
     * @param {string} stripeCustomerId - The Stripe customer's `id`
     * @param {object} updateObj - An object containing the values to be updated (@see https://stripe.com/docs/api/node#update_customer)
     */
    public async updateCustomer(stripeCustomerId: string, updateObj: object): Promise<ApiResponse<Stripe.customers.ICustomer>> {
        try {
            const customer = await stripe.customers.update(stripeCustomerId, updateObj)
            return new ApiResponse(<Stripe.customers.ICustomer>customer)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    /**
     * Update the customer's default card
     *
     * @param {string} stripeCustomerId - The Stripe customer's `id`
     * @param {string} stripeCardId - The `id` of the Stripe source, usually a card (*not* a single-use token)
     * @example `card_19rzdy2eZvKYlo2CzJQXXiuV`
     */
    public async updateCustomerDefaultSource(stripeCustomerId: string, stripeCardId: string): Promise<ApiResponse<Stripe.customers.ICustomer>> {
        try {
            const customer = await stripe.customers.update(stripeCustomerId, { default_source: stripeCardId })
            return new ApiResponse(<Stripe.customers.ICustomer>customer)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }
}
