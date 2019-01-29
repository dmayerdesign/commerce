import { Address } from '@qb/common/domains/address/address.interface'
import { Easypost } from '@qb/common/types/node-easypost'

export function prepareAddressForEasypost(address: Address): Easypost.Address {
  const addressForEasypost = { ...address } as Easypost.Address
  if (!addressForEasypost.country) {
    addressForEasypost.country = 'US'
  }
  return addressForEasypost
}
