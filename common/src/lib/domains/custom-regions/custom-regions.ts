import { Column } from 'typeorm'
import { CustomRegion } from '../custom-region/custom-region'
import { CustomRegions as ICustomRegions } from './custom-regions.interface'

export class CustomRegions implements ICustomRegions {
  @Column(() => CustomRegion) public productDetailInfoHeader?: CustomRegion[]
  @Column(() => CustomRegion) public productDetailMid?: CustomRegion[]
}
