const EasypostModule = require('@easypost/api')
import { Easypost } from '@mte/common/types/node-easypost'
import { inject, injectable } from 'inversify'

import { Address } from '@mte/common/api/entities/address'
import { EasypostRate } from '@mte/common/api/entities/easypost-rate'
import { FindOrderError, Order, UpdateOrderError } from '@mte/common/api/entities/order'
import { OrderStatus } from '@mte/common/constants/enums/order-status'
import { Types } from '@mte/common/constants/inversify/types'
import { OrderService } from './order.service'

const easypost = new EasypostModule(process.env.EASYPOST_API_KEY) as Easypost

@injectable()
export class EasypostService {

    constructor(
        @inject(Types.OrderService) private orderService: OrderService
    ) {}

	/**
	 * Create a shipment in EasyPost
	 *
	 * @param {Address} options.to_address
	 * @param {Address} options.from_address
	 * @param {Parcel} options.parcel
	 * @param {number} options.parcel.length
	 * @param {number} options.parcel.width
	 * @param {number} options.parcel.height
	 * @param {number} options.parcel.weight
	 * @param {object} options.customs_info
	 * @param {string} orderId
     *
     * @returns {Promise<{ order: Order, shipment: Easypost.Shipment }>}
     * @memberof EasypostService
     */
    public createShipment(options, orderId) {
        return new Promise<{ order: Order, shipment: Easypost.Shipment }>(async (resolve, reject) => {
            console.log('Easypost shipment options:')
            console.log(options)

            /* Either objects or ids can be passed in. If the object does
            * not have an id, it will be created. */

            const to_address = new easypost.Address(options.to_address)
            const from_address = new easypost.Address(options.from_address)
            const parcel = new easypost.Parcel(options.parcel)
            const customs_info = new easypost.CustomsInfo(options.customs_info)

            const shipment = new easypost.Shipment({
                to_address,
                from_address,
                parcel,
                customs_info,
            })

            let easypostShipment: Easypost.Shipment
            let order: Order
            let orderWithShipmentData: Order

            // Get the Easypost shipment.

            try {
                easypostShipment = await shipment.save()
                if (!easypostShipment) {
                    return reject(new Error('Couldn\'t create the shipment.'))
                }
            }
            catch (error) {
                reject(error)
                return
            }

            // Get the order from the database.

            try {
                const orderResponse = await this.orderService.getOne(orderId)
                order = orderResponse.body
                if (!easypostShipment) {
                    reject(new FindOrderError('Couldn\'t find the order on which to update shipment details.'))
                    return
                }
            }
            catch (error) {
                reject(error)
                return
            }

            // Update the order with shipment data

            order.shipmentId = easypostShipment.id
            order.shippingRates = easypostShipment.rates as EasypostRate[]
            order.markModified('shippingRates')

            try {
                orderWithShipmentData = await order.save()
            }
            catch (error) {
                reject(error)
                return
            }

            resolve({ order: orderWithShipmentData._doc, shipment: easypostShipment })
        })
    }

	/**
	 * Buy a shipment in EasyPost
	 *
	 * @param {string} orderId
	 * @param {string} rateId
	 * @param {string} shipmentId Order.shipmentId
	 * @param {number} insurance Amount the shipment will be insured for
	 */
    public buyShipment({ orderId, rateId, shipmentId, insurance, estDeliveryDays }: {
        orderId: string
        rateId: string
        shipmentId: string
        insurance: number
        estDeliveryDays: number
    }) {
        return new Promise<{ order: Order, shipment: Easypost.Shipment }>(async (resolve, reject) => {
            let shipment: Easypost.Shipment
            let purchasedShipment: Easypost.Shipment
            let order: Order
            let orderWithShipmentData: Order

            // Retrieve the shipment from Easypost.

            try {
                shipment = await easypost.Shipment.retrieve(shipmentId)
            }
            catch (error) {
                reject(error)
                return
            }

            // Buy the shipment from Easypost.

            try {
                purchasedShipment = await shipment.buy(rateId || shipment.lowestRate(), insurance)
                if (!purchasedShipment) {
                    reject(new Error('Couldn\'t purchase the shipment.'))
                    return
                }
            }
            catch (error) {
                reject(error)
                return
            }

            // Retrieve the order.

            try {
                const orderResponse = await this.orderService.getOne(orderId)
                order = orderResponse.body

                if (!order) {
                    reject(new FindOrderError('Couldn\'t find the order to update with shipment data.'))
                    return
                }
            }
            catch (error) {
                reject(error)
                return
            }

            // Update the order with the shipment data.

            order.status = OrderStatus.Shipped
            order.selectedShippingRateId = purchasedShipment.selected_rate.id
            order.carrier = purchasedShipment.selected_rate ? purchasedShipment.selected_rate.carrier : null
            order.trackingCode = purchasedShipment.tracking_code
            order.postageLabelUrl = purchasedShipment.postage_label
            order.estDeliveryDays = estDeliveryDays

            try {
                orderWithShipmentData = await order.save()
            }
            catch (error) {
                reject(error)
                return
            }

            resolve({
                order: orderWithShipmentData._doc,
                shipment: purchasedShipment
            })
        })
    }

	/**
	 * Verify a customer's shipping address before they place an order
	 *
	 * @param {Address} address The customer's shipping address from the order
	 */
    public verifyAddress(address: Address) {
        return new Promise<Easypost.Address>(async (resolve, reject) => {
            if (!address) {
                return reject(new UpdateOrderError('No shipping address was provided.'))
            }

            // Verify the address.

            const addressToVerify = new easypost.Address(address)
            let verifiedAddress: Easypost.Address

            try {
                verifiedAddress = await addressToVerify.save()
            }
            catch (error) {
                reject(error)
                return
            }

            // Check if the verification was successful.

            if (verifiedAddress.verifications.delivery.success) {
                resolve(verifiedAddress)
            }
            else {
                reject(new Error('The shipping address provided is undeliverable or invalid.'))
            }
        })
    }
}
