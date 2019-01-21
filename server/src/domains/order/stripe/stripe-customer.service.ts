import { Inject, Injectable } from '@nestjs/common'
import { Order } from '@qb/common/api/entities/order'
import { User } from '@qb/common/api/entities/user'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { ApiErrorResponse } from '@qb/common/api/responses/api-error.response'
import * as Stripe from 'stripe'
import { UserRepository } from '../../user/user.repository.generated'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

/**
 * Methods for interacting with the Stripe API
 */
@Injectable()
export class StripeCustomerService {

    @Inject(UserRepository) private _userRepository: UserRepository

    /**
     * If the customer checked "save payment info," create a Stripe Customer
     *
     * @param {Order} order - The order from which the customer's information is being collected
     */
    public async createCustomer(order: Order): Promise<Stripe.customers.ICustomer | undefined> {
        if (order.customer && order.customer.userId && order.stripeToken && order.stripeToken.card) {
            let user: User | undefined
            try {
                user = await this._userRepository.get(order.customer.userId)
            }
            catch (findUserError) {
                throw findUserError
            }
            if (!user) return user

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
                if (!customer) throw new Error(`Couldn't create the customer in Stripe`)

console.log('===== New customer =====')
console.log(customer)

                await this._userRepository.update(new UpdateRequest<User>({
                    id: user.id,
                    update: {
                        stripeCustomerId: customer.id
                    }
                }))
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
    public async addCard(tokenID: string, stripeCustomerId: string): Promise<Stripe.cards.ICard> {
        try {
            const card = await stripe.customers.createSource(stripeCustomerId, { source: tokenID })
            return <Stripe.cards.ICard>card
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
    public async getCustomer(customerId: string): Promise<Stripe.customers.ICustomer> {
        try {
            if (!customerId) {
                throw new Error('No Stripe customer is associated with this user.')
            }
            const customer = await stripe.customers.retrieve(customerId)
            return <Stripe.customers.ICustomer>customer
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
    public async updateCustomer(stripeCustomerId: string, updateObj: object): Promise<Stripe.customers.ICustomer> {
        try {
            const customer = await stripe.customers.update(stripeCustomerId, updateObj)
            return <Stripe.customers.ICustomer>customer
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
    public async updateCustomerDefaultSource(stripeCustomerId: string, stripeCardId: string): Promise<Stripe.customers.ICustomer> {
        try {
            const customer = await stripe.customers.update(stripeCustomerId, { default_source: stripeCardId })
            return <Stripe.customers.ICustomer>customer
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }
}
