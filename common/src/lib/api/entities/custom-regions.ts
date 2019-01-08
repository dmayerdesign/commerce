import { OneToMany } from 'typeorm'
import { CustomRegions as ICustomRegions } from '../interfaces/custom-regions'
import { CustomRegion } from './custom-region'

export class CustomRegions implements ICustomRegions {
  @OneToMany(() => CustomRegion, customRegion => customRegion.id) public productDetailInfoHeader: CustomRegion[]
  @OneToMany(() => CustomRegion, customRegion => customRegion.id) public productDetailMid: CustomRegion[]
}
