import { Copy } from '@qb/common/constants/copy'
import { getSubTotal, getTotal } from '@qb/common/helpers/cart.helpers'

export { getSubTotal, getTotal }

export function calculateEstArrival(days: number): string {
      const currentMillis = Date.now()
      const estArrivalDate = new Date((currentMillis + (days * 86400000)))
      const daysOfTheWeek = Copy.DaysOfTheWeek
      const months = Copy.Months
      return `${daysOfTheWeek[estArrivalDate.getDay()]}, ${months[estArrivalDate.getMonth()]} ${estArrivalDate.getDate()}`
  }
