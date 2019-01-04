import { OneToMany } from 'typeorm'
import { CustomRegion } from './custom-region'

export class CustomRegions {
  @OneToMany(() => CustomRegion, customRegion => customRegion.id) public productDetailInfoHeader: CustomRegion[]
  @OneToMany(() => CustomRegion, customRegion => customRegion.id) public productDetailMid: CustomRegion[]
}
