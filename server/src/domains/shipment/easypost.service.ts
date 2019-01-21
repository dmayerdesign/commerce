const EasypostModule = require('@easypost/api')
import { Inject, Injectable } from '@nestjs/common'
import { Address } from '@qb/common/api/entities/address'
import { EasypostRate } from '@qb/common/api/entities/easypost-rate'
import { Order } from '@qb/common/api/entities/order'
import { UpdateRequest } from '@qb/common/api/requests/update.request'
import { OrderStatus } from '@qb/common/constants/enums/order-status'
import { Easypost } from '@qb/common/types/node-easypost'
import { OrderRepository } from '../order/order.repository.generated'
import { prepareAddressForEasypost } from './easypost.helpers'

const easypost = new EasypostModule(process.env.EASYPOST_API_KEY) as Easypost

@Injectable()
export class EasypostService {

  constructor(
    @Inject(OrderRepository) protected _orderRepository: OrderRepository,
  ) { }

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
  public createShipment(options: Easypost.Shipment, orderId) {
    return new Promise<{ order: Order, shipment: Partial<Easypost.Shipment> }>(async (resolve, reject) => {
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
        order = await this._orderRepository.get(orderId) as Order
        if (!easypostShipment) {
          reject(new Error('Couldn\'t find the order on which to update shipment details.'))
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

      try {
        orderWithShipmentData = await this._orderRepository.update(
          new UpdateRequest<Order>({
            id: order.id,
            update: order
          })
        )
      }
      catch (error) {
        reject(error)
        return
      }

      resolve({ order: orderWithShipmentData, shipment: easypostShipment })
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
  public async buyShipment({ orderId, rateId, shipmentId, insurance, estDeliveryDays }: {
    orderId: string
    rateId: string
    shipmentId: string
    insurance: number
    estDeliveryDays: number
  }) {
    let shipment: Easypost.Shipment
    let purchasedShipment: Easypost.Shipment
    let order: Order
    let orderWithShipmentData: Order

    // Retrieve the shipment from Easypost.

    shipment = await easypost.Shipment.retrieve(shipmentId)

    // Buy the shipment from Easypost.

    purchasedShipment = await shipment.buy(rateId || shipment.lowestRate(), insurance)
    if (!purchasedShipment) {
      throw new Error('Couldn\'t purchase the shipment.')
      return
    }

    // Retrieve the order.

    order = await this._orderRepository.get(orderId) as Order

    if (!order) {
      throw new Error('Couldn\'t find the order to update with shipment data.')
    }

    // Update the order with the shipment data.

    orderWithShipmentData = await this._orderRepository.update(
      new UpdateRequest<Order>({
        id: order.id,
        update: {
          status: OrderStatus.Shipped,
          selectedShippingRateId: purchasedShipment.selected_rate.id,
          carrier: purchasedShipment.selected_rate
            ? purchasedShipment.selected_rate.carrier
            : undefined,
          trackingCode: purchasedShipment.tracking_code,
          postageLabelUrl: purchasedShipment.postage_label,
          estDeliveryDays: estDeliveryDays,
        }
      })
    )

    return {
      order: orderWithShipmentData,
      shipment: purchasedShipment
    }
  }

  /**
	 * Verify a customer's shipping address before they place an order
	 *
	 * @param {Address} address The customer's shipping address from the order
	 */
  public async verifyAddress(address: Address): Promise<Easypost.Address> {
    if (!address) {
      throw new Error('No shipping address was provided.')
    }

    // Verify the address.

    const addressToVerify = new easypost.Address(
      prepareAddressForEasypost(address)
    )
    let verifiedAddress: Easypost.Address

    verifiedAddress = await addressToVerify.save()

    // Check if the verification was successful.

    if (verifiedAddress.verifications.delivery.success) {
      return verifiedAddress
    }
    else {
      throw new Error('The shipping address provided is undeliverable or invalid.')
    }
  }
}
