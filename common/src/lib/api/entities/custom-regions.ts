import { Column } from 'typeorm'
import { CustomRegions as ICustomRegions } from '../interfaces/custom-regions'
import { CustomRegion } from './custom-region'

export class CustomRegions implements ICustomRegions {
  @Column(() => CustomRegion) public productDetailInfoHeader?: CustomRegion[]
  @Column(() => CustomRegion) public productDetailMid?: CustomRegion[]
}
