import { Copy } from '@qb/common/constants/copy'
import { CartHelper } from '@qb/common/helpers/cart.helper'

const { getSubTotal, getTotal } = CartHelper

export { getSubTotal, getTotal }

export function calculateEstArrival(days: number): string {
      const currentMillis = Date.now()
      const estArrivalDate = new Date((currentMillis + (days * 86400000)))
      const daysOfTheWeek = Copy.DaysOfTheWeek
      const months = Copy.Months
      return `${daysOfTheWeek[estArrivalDate.getDay()]}, ${months[estArrivalDate.getMonth()]} ${estArrivalDate.getDate()}`
  }
