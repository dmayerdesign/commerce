import { Address } from '@qb/common/api/interfaces/address'
import { Easypost } from '@qb/common/types/node-easypost'

export function prepareAddressForEasypost(address: Address): Easypost.Address {
  const addressForEasypost = { ...address } as Easypost.Address
  if (!addressForEasypost.country) {
    addressForEasypost.country = 'US'
  }
  return addressForEasypost
}
